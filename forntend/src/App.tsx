import {ThemeProvider} from "./components/theme-provider.tsx";
import SidebarContainer from "@/containers/SidebarContainer.tsx";



const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
           <SidebarContainer/>
        </ThemeProvider>
    );
}

export default App