import {observer} from "mobx-react-lite";
import DashboardPage from "@/components/pages/DashboardPage.tsx";
import {en} from "@/text/en.ts";

const DashboardPageContainer = observer(() => {

    return (
        <DashboardPage
            dataKeyT1={en.dashboardPage.dataKey.dataKeyT1}
            dataKeyT2={en.dashboardPage.dataKey.dataKeyT2}
            dataKeyV={en.dashboardPage.dataKey.dataKeyV}
        />
    )
});

export default DashboardPageContainer;