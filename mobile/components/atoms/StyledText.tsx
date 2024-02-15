import { Text as DefaultText } from "react-native/Libraries/Text/Text";
import { TextProps, useThemeColor } from "../organisms/Themed.tsx";

export function StyledText(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor("text", { light: lightColor, dark: darkColor });

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}
