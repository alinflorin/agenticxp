import { ColorMode } from "@/models/color-mode";
import { useTheme } from "next-themes";

export function useColorMode() {
  const { resolvedTheme, setTheme, theme } = useTheme();

  return {
    theme,
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme
  };
}
