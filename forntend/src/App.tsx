import {ThemeProvider} from "./components/theme-provider.tsx";
import {RouterProvider} from "react-router-dom";
import {router} from "@/roots/root.tsx";
import { Toaster } from "./components/ui/sonner.tsx";



const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
            <Toaster />
        </ThemeProvider>
    );
}

export default App