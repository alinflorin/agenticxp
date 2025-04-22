import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { Provider } from "./theming/provider";
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./configs/oidc";
import { BrowserRouter, Route, Routes } from "react-router";
import "./configs/axios-interceptors";
import "./configs/i18n";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import AuthGuard from "./components/AuthGuard";
import Settings from "./routes/Settings";

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...oidcConfig}>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="settings" element={<AuthGuard component={Settings}></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </AuthProvider>
);
