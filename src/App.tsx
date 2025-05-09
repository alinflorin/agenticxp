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
import userProfileStore from "./stores/user-profile-store";
import userProfileService from "./services/user-profile-service";

export default function App() {
    const {
        user,
        removeUser,
        signinRedirect,
        signinSilent,
        isLoading: authIsLoading,
    } = useAuth();
    const [userProfileLoaded, setUserProfileLoaded] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setUserFromStore] = useStore(userStore);
    const [userProfile, setUserProfile] = useStore(userProfileStore);
    const { i18n, ready: translationReady } = useTranslation();
    const [allLoaded, setAllLoaded] = useState(false);
    const { setColorMode, theme } = useColorMode();

    useEffect(() => {
        if (translationReady && !authIsLoading && userProfileLoaded) {
            setAllLoaded(true);
        }
    }, [translationReady, authIsLoading, userProfileLoaded]);

    const logout = useCallback(() => {
        (async () => {
            await removeUser();
        })();
    }, [removeUser]);

    useEffect(() => {
        if (authIsLoading) {
            return;
        }
        if (user && user.expired) {
            (async () => {
                try {
                    const result = await signinSilent();
                    if (!result) {
                        logout();
                    }
                } catch (e: unknown) {
                    console.error(e);
                    logout();
                }
            })();
            return;
        }
        setUserFromStore(user || undefined);
        if (user && !user.expired) {
            setUserProfileLoaded(false);
            (async () => {
                try {
                const up = await userProfileService.getProfile();
                setUserProfile(up);
                setUserProfileLoaded(true);
                } catch {
                    setUserProfileLoaded(true);
                }
            })();
        } else {
            setUserProfile(undefined);
            setUserProfileLoaded(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        user,
        setUserProfile,
        setUserFromStore,
        signinSilent,
        logout,
        setUserProfileLoaded
    ]);

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
                userProfile={userProfile}
            />
            <Box p={4} flex="auto" minH={0} overflow="auto">
                <Outlet />
            </Box>
            <Footer />
            <Toaster />
        </Flex>
    );
}
