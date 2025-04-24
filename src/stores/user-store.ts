import env from "@/env";
import { BehaviourSubject } from "@/helpers/behaviour-subject";
import { User } from "oidc-client-ts";

function getUser() {
    const oidcStorage = localStorage.getItem(
      `oidc.user:${env.VITE_OIDC_ISSUER}:${env.VITE_OIDC_CLIENT_ID}`
    );
    if (!oidcStorage) {
      return undefined;
    }
    return User.fromStorageString(oidcStorage);
  }

export const userStore = new BehaviourSubject<User | undefined>(getUser());
export default userStore;