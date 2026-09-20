import {ThemeProvider} from "./components/theme-provider.tsx";
import SidebarContainer from "@/containers/SidebarContainer.tsx";
import DashboardPage from "@/components/pages/DashboardPage.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {en} from "@/text/en.ts";
import DevicePage from "@/components/pages/DevicePage.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <SidebarContainer />,
        handle: { crumb: () => en.crumbs.root },
        children: [
            {
                index: true,
                element: <DevicePage />,
                handle: { crumb: () => en.crumbs.dashboardPage },
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