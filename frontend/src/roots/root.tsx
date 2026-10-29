import {createBrowserRouter} from "react-router-dom";
import SidebarContainer from "@/containers/SidebarContainer.tsx";
import {en} from "@/text/en.ts";
import DeviceSettingsPageContainer from "@/containers/pages/DeviceSettingsPageContainer.tsx";
import DataTablePageContainer from "@/containers/pages/DataTablePageContainer.tsx";
import DashboardPageContainer from "@/containers/pages/DashboardPageContainer.tsx";
import {dataStore} from "@/stores/data-store.ts";
import FittingsSettingsPageContainer from "@/containers/pages/FittingsSettingsPageContainer.tsx";
import FittingsDashboardPageContainer from "@/containers/pages/FittingsDashboardPageContainer.tsx";

export const roots = {
    dashboard: "dashboard",
    device: "device",
    dataTable: "data",
    fittingsSettings: "fittings-settings",
    fittingsDashboard: "fittings-dashboard",
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <SidebarContainer dataStore={dataStore}/>,
        handle: { crumb: () => en.crumbs.root },
        children: [
            {
                index: true,
                path: `${roots.dashboard}`,
                element: <DashboardPageContainer dataStore={dataStore} />,
                handle: { crumb: () => en.crumbs.dashboardPage },
            },
            {
                path: `${roots.device}/:variant/:deviceName?/:deviceId?`,
                element: <DeviceSettingsPageContainer dataStore={dataStore} />,
                handle: {
                    crumb: (data) => {
                        const { variant, deviceName, deviceId } = data.params;

                        if (deviceName) {
                            return `${deviceName}`;
                        }
                        return `${en.crumbs.settingsPage}`;
                    }
                },
            },
            {
                path: `${roots.dataTable}`,
                element: <DataTablePageContainer dataStore={dataStore} />,
                handle: {crumb: () => en.crumbs.dataTablePage},
            },
            {
                path: `${roots.fittingsSettings}`,
                element: <FittingsSettingsPageContainer/>,
                handle: {crumb: () => en.crumbs.fittingsSettings},
            },
            {
                path: `${roots.fittingsDashboard}`,
                element: <FittingsDashboardPageContainer/>,
                handle: {crumb: () => en.crumbs.fittingsDashboard},
            }
        ],
    },
]);