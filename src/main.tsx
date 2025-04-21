import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import env from "./env";
import { OidcProvider, OidcSecure } from "@axa-fr/react-oidc";

const oidcConfig = {
  client_id: env.VITE_OIDC_CLIENT_ID,
  redirect_uri: window.location.origin + "/authentication/callback",
  silent_redirect_uri:
    window.location.origin + "/authentication/silent-callback",
  scope: "openid profile email offline_access", // offline_access scope allow your client to retrieve the refresh_token
  authority: env.VITE_OIDC_ISSUER,
  service_worker_relative_url: "/OidcServiceWorker.js", // just comment that line to disable service worker mode
  service_worker_only: false,
  demonstrating_proof_of_possession: false,
};

createRoot(document.getElementById("root")!).render(
  <OidcProvider configuration={oidcConfig}>
    <OidcSecure>
      <App />
    </OidcSecure>
  </OidcProvider>
);
