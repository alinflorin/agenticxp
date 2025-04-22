import env from "@/env";
import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps } from "react-oidc-context";

export const oidcConfig: AuthProviderProps = {
  client_id: env.VITE_OIDC_CLIENT_ID,
  redirect_uri: window.location.origin,
  scope: "openid profile email offline_access",
  authority: env.VITE_OIDC_ISSUER,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: (): void => {
    const pp = sessionStorage.getItem("pp");
    if (pp) {
      sessionStorage.removeItem("pp");
      window.location.replace(pp);
    } else {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },
  automaticSilentRenew: true,
};
