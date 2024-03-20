import { createTamagui } from "tamagui";
import { config as defaultConfig } from "@tamagui/config/v3";
import { darkTheme, lightTheme, themeTokens } from "./theme.ts";

// Most all of the logic is in the theme.ts file, we just use this to tie it
// together and export what we need for tamagui

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  tokens: themeTokens,
});
export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
