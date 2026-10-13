export type ChannelRoleName = "thermocouple_1" | "thermocouple_2" | "voltage_probe";
export type ExperimentChannelMap = Record<ChannelRoleName, { slot: string, channel: string }>;