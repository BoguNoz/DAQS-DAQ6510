import { en } from "@/text/en";
import { observer } from "mobx-react-lite";
import MetricCard from "@/components/layout/charts/MetricCard.tsx";

export interface MetricData {
    value: number | null;
    isStable: boolean;
    data: number[];
}

interface DashboardPageProps {
    t1: MetricData;
    t2: MetricData;
    voltage: MetricData;
}

const DashboardPage = observer((props: DashboardPageProps) => {
    const {t1, t2, voltage} = props;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full pt-6">
            <div className="flex flex-col gap-4">
                <MetricCard
                    title={en.dashboardPage.charts.thermocouple_1}
                    value={t1.value}
                    unit="°C"
                    isStable={t1.isStable}
                    data={t1.data}
                />
                <MetricCard
                    title={en.dashboardPage.charts.thermocouple_2}
                    value={t2.value}
                    unit="°C"
                    isStable={t2.isStable}
                    data={t2.data}
                />
            </div>

            <div className="flex flex-col">
                <MetricCard
                    title={en.dashboardPage.charts.voltage}
                    value={voltage.value}
                    unit="V"
                    isStable={voltage.isStable}
                    data={voltage.data}
                />
            </div>
        </div>
    );
});

export default DashboardPage;