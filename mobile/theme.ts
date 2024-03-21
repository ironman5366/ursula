// Theming
import { Theme } from "@react-navigation/native";
import { Text as DefaultText } from "react-native/Libraries/Text/Text";
import { View as DefaultView } from "react-native/Libraries/Components/View/View";
import { ThemeProps } from "./components/organisms/StyledView.tsx";
import { useColorScheme } from "react-native";
import { createTokens } from "tamagui";
import { config as defaultConfig } from "@tamagui/config/v3";

export const LIGHT_PRIMARY_CLARET = "#832232";
export const LIGHT_SECONDARY_SUNGLOW = "#FDCA40";
export const LIGHT_ACCENT_CAMBRIDGE = "#81B29A";
export const LIGHT_BACKGROUND_WHITE_SMOKE = "#F5F5F5";
export const LIGHT_WARNING_PURPLE = "#9683EC";
export const LIGHT_TEXT_BLACK = "#000";

export const DARK_PRIMARY_EGGPLANT = "#4D1526";
export const DARK_SECONDARY_GOLDEN_BROWN = "#B38728";
export const DARK_ACCENT_DEEP_SEA_GREEN = "#3D655D";
export const DARK_BACKGROUND_RAISIN_BLACK = "#242124";
export const DARK_WARNING_ELECTRIC_PURPLE = "#7A5DC7";
export const DARK_TEXT_LIGHT_GRAY = "#D3D3D3";

export const themeTokens = createTokens({
  color: {
    claret: LIGHT_PRIMARY_CLARET,
    sunglow: LIGHT_SECONDARY_SUNGLOW,
    cambridgeBlue: LIGHT_ACCENT_CAMBRIDGE,
    purple: LIGHT_WARNING_PURPLE,
    eggplant: DARK_PRIMARY_EGGPLANT,
    goldenBrown: DARK_SECONDARY_GOLDEN_BROWN,
    deepSeaGreen: DARK_ACCENT_DEEP_SEA_GREEN,
    raisinBlack: DARK_BACKGROUND_RAISIN_BLACK,
    electricPurple: DARK_WARNING_ELECTRIC_PURPLE,
    lightGray: DARK_TEXT_LIGHT_GRAY,
    whiteSmoke: LIGHT_BACKGROUND_WHITE_SMOKE,
  },
  space: defaultConfig.tokens.space,
  size: defaultConfig.tokens.size,
  radius: defaultConfig.tokens.radius,
  zIndex: defaultConfig.tokens.zIndex,
});

/**
 * The properties that tamagui pays attention to:
 * {
 *   background: string
 *   backgroundFocus: string
 *   backgroundHover: string
 *   backgroundPress: string
 *   borderColor: string
 *   borderColorFocus: string
 *   borderColorHover: string
 *   borderColorPress: string
 *   color: string
 *   colorFocus: string
 *   colorHover: string
 *   colorPress: string
 *   colorTransparent: string
 *   placeholderColor: string
 *   shadowColor: string
 *   shadowColorFocus: string
 *   shadowColorHover: string
 *   shadowColorPress: string
 * }
 */

export const TAMAGUI_THEMES = {
  light: {
    background: themeTokens.color.whiteSmoke,
    backgroundFocus: "white",
    backgroundHover: "white",
    borderColor: themeTokens.color.claret,
    borderColorFocus: themeTokens.color.cambridgeBlue,
    borderColorHover: themeTokens.color.cambridgeBlue,
    borderColorPress: themeTokens.color.sunglow,
    color: "black",
    colorFocus: themeTokens.color.cambridgeBlue,
    colorHover: themeTokens.color.cambridgeBlue,
    colorPress: themeTokens.color.cambridgeBlue,
    shadowColor: themeTokens.color.sunglow,
    borderWidth: 2,
  },
  light_Button: {
    color: themeTokens.color.claret,
  },
  light_ListItem: {
    borderColor: themeTokens.color.claret,
    color: themeTokens.color.sunglow,
  },
  dark: {
    background: themeTokens.color.raisinBlack,
    backgroundFocus: themeTokens.color.raisinBlack,
    backgroundHover: themeTokens.color.raisinBlack,
    borderColor: themeTokens.color.electricPurple,
    borderColorFocus: themeTokens.color.electricPurple,
    borderColorHover: themeTokens.color.electricPurple,
    borderColorPress: themeTokens.color.deepSeaGreen,
    color: "white",
    colorFocus: themeTokens.color.electricPurple,
    colorHover: themeTokens.color.electricPurple,
    colorPress: themeTokens.color.electricPurple,
    placeholderColor: themeTokens.color.deepSeaGreen,
    shadowColor: themeTokens.color.deepSeaGreen,
  },
  dark_Button: {
    color: themeTokens.color.eggplant,
  },
};

// TODO: this should go away and we should be totally on tamagui
export const Colors = {
  light: {
    text: LIGHT_TEXT_BLACK,
    background: LIGHT_BACKGROUND_WHITE_SMOKE,
    tint: LIGHT_PRIMARY_CLARET,
    tabIconDefault: "#370031",
    tabIconSelected: LIGHT_PRIMARY_CLARET,
    primary: LIGHT_PRIMARY_CLARET,
    card: "rgb(255, 255, 255)",
    border: "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)",
    disabled: "gray",
  },
  dark: {
    text: DARK_TEXT_LIGHT_GRAY,
    background: DARK_BACKGROUND_RAISIN_BLACK,
    tint: DARK_PRIMARY_EGGPLANT,
    tabIconDefault: "#370031",
    tabIconSelected: DARK_PRIMARY_EGGPLANT,
    primary: DARK_PRIMARY_EGGPLANT,
    card: "rgb(18, 18, 18)",
    border: "rgb(39, 39, 41)",
    notification: "rgb(255, 69, 58)",
    disabled: "white",
  },
};

export const DARK_THEME: Theme = {
  dark: true,
  colors: Colors.dark,
};

export const LIGHT_THEME: Theme = {
  dark: false,
  colors: Colors.light,
};

export type StyledTextProps = ThemeProps & DefaultText["props"];
export type StyledViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
  props: { light?: string; dark?: string } = {}
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
