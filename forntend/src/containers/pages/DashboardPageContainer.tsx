import {observer} from "mobx-react-lite";
import DashboardPage from "@/components/pages/DashboardPage.tsx";
import type {DataStoreInterface} from "@/stores/data-store.ts";
import {useCallback} from "react";


interface DashboardPageContainerProps {
    dataStore: DataStoreInterface;
}

const DashboardPageContainer = observer((props: DashboardPageContainerProps) => {
    const {dataStore} = props

    const status = dataStore.getExperimentStatus();
    const temperaturesStable = status?.state === "MEASURING_VOLTAGE" || status?.state === "DONE";
    const voltageStable = status?.state === "DONE";

    return (
        <DashboardPage
            t1={{
                value: status?.thermocouple_1_temperature ?? null,
                isStable: temperaturesStable,
                data: dataStore.getT1Series(),
            }}
            t2={{
                value: status?.thermocouple_2_temperature ?? null,
                isStable: temperaturesStable,
                data: dataStore.getT2Series(),
            }}
            voltage={{
                value: status?.voltage ?? null,
                isStable: voltageStable,
                data: dataStore.getVoltageSeries(),
            }}
        />
    )
});

export default DashboardPageContainer;