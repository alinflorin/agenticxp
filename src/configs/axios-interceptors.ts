import env from "@/env";
import { User } from "oidc-client-ts";
import axios from "axios";

function getUser() {
  const oidcStorage = localStorage.getItem(
    `oidc.user:${env.VITE_OIDC_ISSUER}:${env.VITE_OIDC_CLIENT_ID}`
  );
  if (!oidcStorage) {
    return null;
  }
  return User.fromStorageString(oidcStorage);
}

axios.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user && user.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
