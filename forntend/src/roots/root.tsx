import {createBrowserRouter} from "react-router-dom";
import SidebarContainer from "@/containers/SidebarContainer.tsx";
import {en} from "@/text/en.ts";
import DashboardPage from "@/components/pages/DashboardPage.tsx";
import DeviceSettingsPageContainer from "@/containers/pages/DeviceSettingsPageContainer.tsx";
import DataTablePageContainer from "@/containers/pages/DataTablePageContainer.tsx";

export const roots = {
    dashboard: "dashboard",
    device: "device",
    dataTable: "data",
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <SidebarContainer />,
        handle: { crumb: () => en.crumbs.root },
        children: [
            {
                index: true,
                element: <DashboardPage />,
                handle: { crumb: () => en.crumbs.dashboardPage },
            },
            {
                path: `${roots.device}/:variant/:deviceName?/:deviceId?`,
                element: <DeviceSettingsPageContainer />,
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
                element: <DataTablePageContainer />,
                handle: {crumb: () => en.crumbs.dataTablePage},
            },
        ],
    },
]);