import { ThemeProvider } from "./components/theme-provide";
import { Toaster } from "@/components/ui/sonner"
// import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter} from "react-router";
import AppRoute from "./routes";

export function App() {
    return (
       
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {/* <AuthProvider> */}
                <BrowserRouter>
                    <AppRoute/>
                </BrowserRouter>
            {/* </AuthProvider> */}
            <Toaster position="top-right" richColors />
        </ThemeProvider>
       
       
    );
}
export default App
