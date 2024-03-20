// Theming
import { Theme } from "@react-navigation/native";
import { Text as DefaultText } from "react-native/Libraries/Text/Text";
import { View as DefaultView } from "react-native/Libraries/Components/View/View";
import { ThemeProps } from "./components/organisms/StyledView.tsx";
import { useColorScheme } from "react-native";
import "@tamagui/themes/v3";
import { color, radius, size, space, themes, zIndex } from "@tamagui/themes";
import { createTamagui, createTokens } from "tamagui";

export const LIGHT_TINT = "#832232";
export const DARK_TINT = "#CE8964";

export const Colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: LIGHT_TINT,
    tabIconDefault: "#370031",
    tabIconSelected: LIGHT_TINT,
    primary: LIGHT_TINT,
    card: "rgb(255, 255, 255)",
    border: "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)",
    disabled: "gray",
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: DARK_TINT,
    tabIconDefault: "#370031",
    tabIconSelected: DARK_TINT,
    primary: DARK_TINT,
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
