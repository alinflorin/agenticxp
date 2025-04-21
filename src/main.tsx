import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import { OidcProvider } from "@axa-fr/react-oidc";
import { Provider } from "./theming/provider";
import { oidcConfig } from "./configs/oidc";
import './configs/i18n';

createRoot(document.getElementById("root")!).render(
  <Provider>
    <OidcProvider configuration={oidcConfig}>
      <App />
    </OidcProvider>
  </Provider>
);
