import {
    Avatar,
    Box,
    Flex,
    Text,
    Menu,
    Portal,
    MenuSelectionDetails,
    defineStyle,
} from "@chakra-ui/react";
import { User } from "oidc-client-ts";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { LuChevronRight } from "react-icons/lu";
import { useColorModeValue } from "@/hooks/useColorModeValue";
import { languages } from "@/constants/languages";
import { toCapitalCase } from "@/helpers/string-helpers";
import { UserProfile } from "@/shared-models/user-profile";

export interface HeaderProps {
    user: User | undefined;
    onLogoutClicked: () => void;
    onLoginClicked: () => void;
    currentLanguageCode: string;
    supportedLanguages: readonly string[];
    onLanguageChanged: (newLng: string) => void;
    currentTheme: string;
    onThemeChanged: (newTheme: string) => void;
    userProfile: UserProfile | undefined;
}

const adminRingCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "colorPalette.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
});

export default function Header(props: HeaderProps) {
    const { t } = useTranslation();

    const menuItemSelected = useCallback(
        (details: MenuSelectionDetails) => {
            if (!details.value) {
                return;
            }
            switch (details.value) {
                case "login":
                    props.onLoginClicked();
                    break;
                case "logout":
                    props.onLogoutClicked();
                    break;
                default:
                    return;
            }
        },
        [props]
    );

    return (
        <Box
            px={4}
            w="100%"
            bg={useColorModeValue("gray.100", "gray.900")}
            boxShadow="sm"
        >
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                <Text fontSize="lg" fontWeight="bold">
                    AgenticXP
                </Text>

                <Flex alignItems={"center"} gap={2}>
                    <Menu.Root
                        positioning={{ slide: false }}
                        onSelect={menuItemSelected}
                    >
                        <Menu.Trigger>
                            <Avatar.Root
                                css={
                                    props.userProfile?.is_admin
                                        ? adminRingCss
                                        : undefined
                                }
                                cursor="pointer"
                            >
                                <Avatar.Fallback
                                    name={props.user?.profile.name}
                                />
                            </Avatar.Root>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content>
                                    <Menu.Root
                                        positioning={{ slide: false }}
                                        onSelect={(d) =>
                                            props.onLanguageChanged(d.value)
                                        }
                                    >
                                        <Menu.TriggerItem
                                            justifyContent={"space-between"}
                                        >
                                            {t("ui.header.language")}{" "}
                                            <LuChevronRight />
                                        </Menu.TriggerItem>
                                        <Portal>
                                            <Menu.Positioner>
                                                <Menu.Content>
                                                    {props.supportedLanguages.map(
                                                        (l) => (
                                                            <Menu.Item
                                                                fontWeight={
                                                                    l ===
                                                                    props.currentLanguageCode
                                                                        ? "bold"
                                                                        : "normal"
                                                                }
                                                                key={l}
                                                                value={l}
                                                            >
                                                                {toCapitalCase(
                                                                    languages[l]
                                                                        .nativeName
                                                                )}
                                                            </Menu.Item>
                                                        )
                                                    )}
                                                </Menu.Content>
                                            </Menu.Positioner>
                                        </Portal>
                                    </Menu.Root>
                                    <Menu.Root
                                        positioning={{ slide: false }}
                                        onSelect={(d) =>
                                            props.onThemeChanged(d.value)
                                        }
                                    >
                                        <Menu.TriggerItem
                                            justifyContent={"space-between"}
                                        >
                                            {t("ui.header.theme")}{" "}
                                            <LuChevronRight />
                                        </Menu.TriggerItem>
                                        <Portal>
                                            <Menu.Positioner>
                                                <Menu.Content>
                                                    <Menu.Item
                                                        fontWeight={
                                                            "system" ===
                                                            props.currentTheme
                                                                ? "bold"
                                                                : "normal"
                                                        }
                                                        value="system"
                                                    >
                                                        {t(
                                                            "ui.header.themes.system"
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        fontWeight={
                                                            "light" ===
                                                            props.currentTheme
                                                                ? "bold"
                                                                : "normal"
                                                        }
                                                        value="light"
                                                    >
                                                        {t(
                                                            "ui.header.themes.light"
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        fontWeight={
                                                            "dark" ===
                                                            props.currentTheme
                                                                ? "bold"
                                                                : "normal"
                                                        }
                                                        value="dark"
                                                    >
                                                        {t(
                                                            "ui.header.themes.dark"
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Content>
                                            </Menu.Positioner>
                                        </Portal>
                                    </Menu.Root>
                                    {!props.user && (
                                        <Menu.Item value="login">
                                            {t("ui.header.login")}
                                        </Menu.Item>
                                    )}
                                    {props.user && (
                                        <Menu.Item value="logout">
                                            {t("ui.header.logout")}
                                        </Menu.Item>
                                    )}
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                </Flex>
            </Flex>
        </Box>
    );
}
