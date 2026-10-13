import {ThemeProvider} from "./components/theme-provider.tsx";
import {RouterProvider} from "react-router-dom";
import {router} from "@/roots/root.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import {wsClient} from "@/services/ws-client.ts";
import {dataStore} from "@/stores/data-store.ts";
import { useEffect } from "react";

const startRealtime = (): (() => void) => {
    wsClient.connect({
        onOpen: () => {
            void dataStore.getExperimentHistory().catch(() => {});
        },
    });

    const stopListening = dataStore.startListeningExperimentStatus();

    return () => {
        stopListening();
        wsClient.disconnect();
    };
};

const App = () => {

    useEffect(() => startRealtime(), []);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
            <Toaster />
        </ThemeProvider>
    );
}

export default App