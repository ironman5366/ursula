import React, { ComponentProps, ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { useThemeColor } from "./Themed.tsx";
import ThemeColor from "../../types/ThemeColor.ts";

type ChildrenOrTitle =
  | {
      children: ReactNode;
      title?: never;
    }
  | {
      title: string;
      children?: never;
    };

type StyledButtonProps = Omit<
  ComponentProps<typeof Pressable>,
  "children" | "style"
> &
  ChildrenOrTitle & {
    backgroundColor?: ThemeColor;
    style?: StyleProp<ViewStyle>;
    defaultStyle?: StyleProp<ViewStyle>;
    pressedStyle?: StyleProp<ViewStyle>;
    fontColor?: string;
  };

export default function StyledButton({
  backgroundColor,
  style,
  defaultStyle,
  pressedStyle,
  fontColor,
  children,
  title,
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
      {...props}
    >
      {title ? (
        <Text
          style={{
            color: fontColor || "white",
          }}
        >
          {title}
        </Text>
      ) : (
        children
      )}
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
