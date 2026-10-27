import { WSClient } from "@/services/base-ws-client.ts";

const wsUrl = import.meta.env.VITE_WS_URL ?? "ws://127.0.0.1:12345";

export const wsClient = new WSClient(wsUrl);