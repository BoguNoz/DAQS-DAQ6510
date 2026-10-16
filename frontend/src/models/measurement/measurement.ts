export interface Measurement {
    hash: string;
    device: { hash: string; name: string; logo: string };
    time: Date;
    t1: number;
    t2: number;
    voltage: number;
}