/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { View as DefaultView } from "react-native";

import { StyledViewProps, useThemeColor } from "../../theme.ts";

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export function StyledView(props: StyledViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor("background", {
    light: lightColor,
    dark: darkColor,
  });

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
