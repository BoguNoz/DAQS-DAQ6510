export interface WSResponse<T = unknown> {
    type: "response"
    id: string;
    ok: boolean;
    payload: T;
}