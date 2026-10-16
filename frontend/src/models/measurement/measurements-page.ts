import type {Measurement} from "@/models/measurement/measurement.ts";

export interface MeasurementsPage {
    items: Measurement[];
    total: number;
}