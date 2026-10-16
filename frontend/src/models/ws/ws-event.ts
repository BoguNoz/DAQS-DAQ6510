export interface WSEvent<T = unknown> {
    type: string;
    payload: T;
}