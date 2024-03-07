// Theming
import { Theme } from "@react-navigation/native";
import { Text as DefaultText } from "react-native/Libraries/Text/Text";
import { View as DefaultView } from "react-native/Libraries/Components/View/View";
import { ThemeProps } from "./components/organisms/StyledView.tsx";
import { useColorScheme } from "react-native";

const tintColorLight = "#832232";
const tintColorDark = "#CE8964";

export const Colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#370031",
    tabIconSelected: tintColorLight,
    primary: tintColorLight,
    card: "rgb(255, 255, 255)",
    border: "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)",
    disabled: "gray",
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#370031",
    tabIconSelected: tintColorDark,
    primary: tintColorDark,
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
