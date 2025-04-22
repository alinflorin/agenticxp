import { ComponentType } from "react";
import { withAuthenticationRequired } from "react-oidc-context";

export default function AuthGuard({
  component,
}: {
  component: ComponentType<object>;
}) {
  const Component = withAuthenticationRequired(component, {
    onBeforeSignin: () => {
      sessionStorage.setItem(
        "pp",
        window.location.pathname + window.location.search + window.location.hash
      );
    },
  });
  return <Component />;
}
