import {WSClient} from "@/services/base-ws-client.ts";

export const wsClient = new WSClient(import.meta.env.VITE_WS_URL);