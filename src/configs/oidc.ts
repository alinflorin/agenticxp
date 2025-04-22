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
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};
