import {ThemeProvider} from "./components/theme-provider.tsx";
import {RouterProvider} from "react-router-dom";
import {router} from "@/roots/root.tsx";



const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App