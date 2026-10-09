export interface WSRequest<T = unknown> {
    id: string;
    action: string;
    payload: T;
}