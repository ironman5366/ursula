// Theming
import { Theme } from "@react-navigation/native";

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
