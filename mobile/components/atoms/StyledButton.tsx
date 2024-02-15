import React, { ComponentProps } from "react";
import {
  Button,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { useThemeColor } from "../organisms/Themed";
import ThemeColor from "../../types/ThemeColor";

interface StyledButtonProps
  extends Omit<ComponentProps<typeof Pressable>, "children" | "style"> {
  backgroundColor?: ThemeColor;
  title: string;
  style?: StyleProp<ViewStyle>;
  defaultStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  fontColor?: string;
}

export default function StyledButton({
  backgroundColor,
  style,
  defaultStyle,
  pressedStyle,
  fontColor,
  ...props
}: StyledButtonProps) {
  const buttonColor = useThemeColor(backgroundColor || "tint");
  const pressedColor = useThemeColor(backgroundColor || "primary");

  return (
    <Pressable
      style={({ pressed }) => {
        let buttonStyles: StyleProp<ViewStyle> = [styles.container, style];

        if (pressed) {
          buttonStyles.push(pressedStyle, styles.pressed, {
            backgroundColor: pressedColor,
          });
        } else {
          buttonStyles.push(defaultStyle, styles.default, {
            backgroundColor: buttonColor,
          });
        }

        return buttonStyles;
      }}
    >
      <Text
        style={{
          color: fontColor || "white",
        }}
      >
        {props.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 5,
  },
  pressed: {},
  default: {},
});
