// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w: any = window;
export const env = {
    VITE_OIDC_ISSUER: w.VITE_OIDC_ISSUER || import.meta.env.VITE_OIDC_ISSUER,
    VITE_OIDC_CLIENT_ID: w.VITE_OIDC_CLIENT_ID || import.meta.env.VITE_OIDC_CLIENT_ID
};

export default env;