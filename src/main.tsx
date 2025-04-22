import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { Provider } from "./theming/provider";
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./configs/oidc";
import "./configs/axios-interceptors";
import "./configs/i18n";

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...oidcConfig}>
    <Provider>
      <App />
    </Provider>
  </AuthProvider>
);
