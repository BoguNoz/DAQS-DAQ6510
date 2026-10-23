import {WSClient} from "@/services/base-ws-client.ts";

const wsUrl = import.meta.env.DEV
    ? import.meta.env.VITE_WS_URL ?? "ws://127.0.0.1:12345"
    : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`;

export const wsClient = new WSClient(wsUrl);