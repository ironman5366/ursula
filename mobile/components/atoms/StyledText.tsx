import { Text as DefaultText } from "react-native";
import { useThemeColor, StyledTextProps } from "../../theme.ts";

export function StyledText(props: StyledTextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor("text", { light: lightColor, dark: darkColor });

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}
