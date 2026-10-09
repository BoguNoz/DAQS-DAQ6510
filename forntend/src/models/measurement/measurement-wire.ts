import type {Measurement} from "@/models/measurement/measurement.ts";


// kształt z sieci: czas przychodzi jako tekst
export interface MeasurementWire extends Omit<Measurement, "time"> {
    time: string;
}