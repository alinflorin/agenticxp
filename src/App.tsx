import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAuth } from "react-oidc-context";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "./components/Loading";
import { useColorMode } from "./hooks/useColorMode";
import { Toaster } from "./components/Toaster";
import useStore from "./hooks/useStore";
import userStore from "./stores/user-store";

export default function App() {
  const {
    user,
    signoutRedirect,
    signinRedirect,
    isLoading: authIsLoading,
  } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUserFromStore] = useStore(userStore);
  const { i18n, ready: translationReady } = useTranslation();
  const [allLoaded, setAllLoaded] = useState(false);
  const { setColorMode, theme } = useColorMode();

  useEffect(() => {
    if (translationReady && !authIsLoading) {
      setAllLoaded(true);
    }
  }, [translationReady, authIsLoading]);


  useEffect(() => {
    if (authIsLoading) {
        return;
    }
    setUserFromStore(user || undefined);
  }, [user, setUserFromStore, authIsLoading]);

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

  const changeLanguage = useCallback(
    (newLng: string) => {
      (async () => {
        await i18n.changeLanguage(newLng);
      })();
    },
    [i18n]
  );

  const changeTheme = useCallback(
    (newTheme: string) => {
      setColorMode(newTheme);
      localStorage.setItem("theme", newTheme);
    },
    [setColorMode]
  );

  if (!allLoaded) {
    return <Loading />;
  }

  return (
    <Flex flexDirection="column" w="100%" h="100%">
      <Header
        onLoginClicked={login}
        onLogoutClicked={logout}
        currentLanguageCode={i18n.language}
        supportedLanguages={(
          i18n.options.supportedLngs as readonly string[]
        ).filter((x) => x !== "cimode")}
        onLanguageChanged={changeLanguage}
        user={user || undefined}
        currentTheme={theme || "system"}
        onThemeChanged={changeTheme}
      />
      <Box p={4} flex="auto" minH={0} overflow="auto">
        <Outlet />
      </Box>
      <Footer />
      <Toaster />
    </Flex>
  );
}
