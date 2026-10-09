import type {WSRequest} from "@/models/ws/ws-request.ts";
import type { WSResponse } from "@/models/ws/ws-response";
import type {WSEvent} from "@/models/ws/ws-event.ts";

interface PendingRequest {
    resolve: (payload: any) => void;
    reject: (reason: Error) => void;
    timer: ReturnType<typeof setTimeout>;
}

export interface WsLifecycleHandlers {
    onOpen?: () => void;
    onClose?: () => void;
}

export class WSClient {
    private socket: WebSocket | null = null;
    private seq = 0;
    private pending = new Map<string, PendingRequest>();
    private listeners = new Map<string, Set<(payload: any) => void>>();
    private lifecycle: WsLifecycleHandlers = {};
    private active = false;
    private reconnectAttempt = 0;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    private timeoutMs = 10_000;
    private maxBackoffMs = 10_000;
    private readonly url: string;

    constructor(url: string) {
        this.url = url;
    }



    connect = (lifecycle: WsLifecycleHandlers = {}): void => {
        if (this.active) return;
        this.active = true;
        this.lifecycle = lifecycle;
        this.open();
    };

    disconnect = (): void => {
        this.active = false;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        const socket = this.socket;
        this.socket = null;                 // zdarzenia starego gniazda przestają się liczyć
        this.failAllPending();
        socket?.close();
        this.lifecycle.onClose?.();
    };

    request = <T = unknown>(action: string, payload: unknown = {}): Promise<T> =>
        new Promise<T>((resolve, reject) => {
            const socket = this.socket;
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                reject();
                return;
            }

            const id = String(++this.seq);
            const timer = setTimeout(() => {
                this.pending.delete(id);
                reject();
            }, this.timeoutMs);

            this.pending.set(id, {resolve, reject, timer});
            const request: WSRequest = {id, action, payload};
            socket.send(JSON.stringify(request));
        });

    on = <T = unknown>(eventType: string, handler: (payload: T) => void): (() => void) => {
        let handlers = this.listeners.get(eventType);
        if (!handlers) {
            handlers = new Set();
            this.listeners.set(eventType, handlers);
        }
        handlers.add(handler);
        return () => handlers!.delete(handler);
    };

    private open(): void {
        const socket = new WebSocket(this.url);
        this.socket = socket;

        socket.onopen = () => {
            if (this.socket !== socket) return;
            this.reconnectAttempt = 0;
            this.lifecycle.onOpen?.();
        };

        socket.onmessage = (event) => {
            if (this.socket !== socket) return;
            this.handleMessage(event.data);
        };

        socket.onclose = () => {
            if (this.socket !== socket) return;
            this.socket = null;
            this.failAllPending();
            this.lifecycle.onClose?.();
            this.scheduleReconnect();
        };
    }

    private handleMessage(raw: unknown): void {
        let message: WSResponse | WSEvent;
        try {
            message = JSON.parse(String(raw));
        } catch {
            return;
        }

        if (message.type === "response") {
            const response = message as WSResponse;
            const request = this.pending.get(response.id);
            if (!request) return;                   // np. odpowiedź po timeoucie
            clearTimeout(request.timer);
            this.pending.delete(response.id);

            if (response.ok) {
                request.resolve(response.payload);
            } else {
                request.reject(new Error());
            }
            return;
        }

        this.listeners.get(message.type)?.forEach((handler) => handler(message.payload));
    }

    private scheduleReconnect(): void {
        if (!this.active) return;
        const delay = Math.min(500 * 2 ** this.reconnectAttempt, this.maxBackoffMs);
        this.reconnectAttempt++;
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.open();
        }, delay);
    }

    private failAllPending(): void {
        this.pending.forEach((request) => {
            clearTimeout(request.timer);
            request.reject(new Error());
        });
        this.pending.clear();
    }
}