import { en } from "@/text/en";
import { observer } from "mobx-react-lite";
import MetricCard from "@/components/layout/charts/MetricCard.tsx";

interface DashboardPageProps {
    dataKeyT1: string
    dataKeyT2: string
    dataKeyV: string
}

const DashboardPage = observer((props: DashboardPageProps) => {
    const {dataKeyT1, dataKeyT2, dataKeyV} = props;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full pt-6">
            <div className="flex flex-col gap-4">
                <MetricCard
                    title={en.dashboardPage.charts.thermocouple_1}
                    value={1/*experimentStore.thermocouple_1_temperature*/}
                    unit="°C"
                    isStable={true/*experimentStore.isT1Stable*/}
                    dataKey={dataKeyT1}
                />
                <MetricCard
                    title={en.dashboardPage.charts.thermocouple_2}
                    value={1}
                    unit="°C"
                    isStable={false}
                    dataKey={dataKeyT2}
                />
            </div>

            <div className="flex flex-col">
                <MetricCard
                    title={en.dashboardPage.charts.voltage}
                    value={1}
                    unit="°C"
                    isStable={true}
                    dataKey={dataKeyV}
                />
            </div>
        </div>
    );
});

export default DashboardPage;