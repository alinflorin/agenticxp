import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "react-oidc-context";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function App() {
  const { user, signoutRedirect, signinRedirect } = useAuth();
  const { i18n } = useTranslation();
  
  const logout = useCallback(() => {
    (async () => {
      await signoutRedirect();
    })();
  }, [signoutRedirect]);

  const login = useCallback(() => {
    (async () => {
      await signinRedirect();
    })();
  }, [signinRedirect]);

  const changeLanguage = useCallback((newLng: string) => {
    (async () => {
      await i18n.changeLanguage(newLng);
    })()
  }, [i18n]);

  return (
    <Flex flexDirection="column" w="100%" h="100%">
      <Header
        onLoginClicked={login}
        onLogoutClicked={logout}
        currentLanguageCode={i18n.language}
        supportedLanguages={(i18n.options.supportedLngs as (readonly string[])).filter(x => x !== 'cimode')}
        onLanguageChanged={changeLanguage}
        user={user || undefined}
      />
      <Box p={4} flex="auto" minH={0} overflow="auto">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  );
}
