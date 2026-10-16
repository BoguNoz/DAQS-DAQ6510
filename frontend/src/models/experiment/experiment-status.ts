export type ExperimentStateType =
    | "IDLE"
    | "MEASURING_TEMPERATURE"
    | "MEASURING_VOLTAGE"
    | "DONE";

export interface ExperimentStatus {
    state: ExperimentStateType;
    thermocouple_1_temperature: number | null;
    thermocouple_2_temperature: number | null;
    voltage: number | null;
    seebeck_coefficient: number | null;
}
