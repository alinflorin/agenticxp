import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./configs/oidc";
import { BrowserRouter, Route, Routes } from "react-router";
import "./configs/axios-interceptors";
import "./configs/i18n";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import AuthGuard from "./components/AuthGuard";
import Settings from "./routes/Settings";

const theme = localStorage.getItem("theme");

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...oidcConfig}>
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider
        enableSystem={true}
        defaultTheme={theme && theme !== "system" ? theme : undefined}
        attribute="class"
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route
                path="settings"
                element={<AuthGuard component={Settings}></AuthGuard>}
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ChakraProvider>
  </AuthProvider>
);
