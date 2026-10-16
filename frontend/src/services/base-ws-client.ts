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

    private openWaiters = new Set<() => void>();

    constructor(url: string) {
        this.url = url;
    }


    private waitForOpen(): Promise<void> {
        if (this.socket?.readyState === WebSocket.OPEN) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const waiter = () => {
                clearTimeout(timer);
                resolve();
            };
            const timer = setTimeout(() => {
                this.openWaiters.delete(waiter);
                reject(new Error("No server connection"));
            }, this.timeoutMs);
            this.openWaiters.add(waiter);
        });
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

    request = async <T = unknown>(action: string, payload: unknown = {}): Promise<T> => {
        await this.waitForOpen();

        return new Promise<T>((resolve, reject) => {
            const socket = this.socket;
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                reject("No server connection");
                return;
            }

            const id = String(++this.seq);
            const timer = setTimeout(() => {
                this.pending.delete(id);
                reject(new Error(`No response for '${action}'`));
            }, this.timeoutMs);

            this.pending.set(id, {resolve, reject, timer});
            const request: WSRequest = {id, action, payload};
            socket.send(JSON.stringify(request));
        });
    }

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
            this.openWaiters.forEach((waiter) => waiter());
            this.openWaiters.clear();
            this.lifecycle.onOpen?.();
        };

        socket.onmessage = (event) => {
            if (this.socket !== socket) return;
            this.handleMessage(event.data);
        };

        socket.onclose = (event) => {
            if (this.socket !== socket) return;
            this.socket = null;
            this.failAllPending(
                `WebSocket closed (code=${event.code}, reason=${event.reason || "none"})`
            );
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
                const msg =
                    (response.payload as any)?.message ??
                    (response.payload as any)?.error ??
                    "Request failed";
                request.reject(new Error(String(msg)));
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

    private failAllPending(reason = "WebSocket closed"): void {
        this.pending.forEach((request) => {
            clearTimeout(request.timer);
            request.reject(new Error(reason));
        });
        this.pending.clear();
    }
}