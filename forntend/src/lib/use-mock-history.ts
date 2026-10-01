import { useEffect, useState } from "react";

interface MockOptions {
    intervalMs?: number;
    target?: number;      // wartość, do której "dąży" sygnał (symulacja stabilizacji)
    noise?: number;        // amplituda losowego szumu
    startValue?: number;
}

export function useMockHistory({
                                   intervalMs = 1000,
                                   target = 25,
                                   noise = 0.3,
                                   startValue = 15,
                               }: MockOptions = {}): number[] {
    const [history, setHistory] = useState<number[]>([startValue]);

    useEffect(() => {
        const id = setInterval(() => {
            setHistory((prev) => {
                const last = prev[prev.length - 1];
                const step = (target - last) * 0.05;          // powolne zbliżanie się do target
                const randomNoise = (Math.random() - 0.5) * noise;
                return [...prev, last + step + randomNoise];
            });
        }, intervalMs);

        return () => clearInterval(id);
    }, [intervalMs, target, noise]);

    return history;
}