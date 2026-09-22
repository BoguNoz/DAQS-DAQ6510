import {ThemeProvider} from "./components/theme-provider.tsx";
import SidebarContainer from "@/containers/SidebarContainer.tsx";
import DashboardPage from "@/components/pages/DashboardPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {en} from "@/text/en.ts";
import DeviceSettingsPageContainer from "@/containers/pages/DeviceSettingsPageContainer.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <SidebarContainer />,
        handle: { crumb: () => en.crumbs.root },
        children: [
            // Domyślne przekierowanie z / na np. /device/inspect lub widok główny
            {
                index: true,
                element: <DashboardPage />,
                handle: { crumb: () => en.crumbs.settingsPage },
            },
            {
                path: "device/:variant",
                element: <DeviceSettingsPageContainer />,
                handle: {
                    crumb: (data) => `${en.crumbs.settingsPage} (${data.params.variant})`
                },
            },
        ],
    },
]);

const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App