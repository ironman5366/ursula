import React, { ComponentProps, ReactNode, forwardRef } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import ThemeColor from "../../types/ThemeColor.ts";
import { useThemeColor } from "../../theme.ts";

type ChildrenOrTitle =
  | {
      children: ReactNode;
      title?: never;
    }
  | {
      title: string;
      children?: never;
    };

export type ButtonVariant = "filled" | "outline";

type StyledButtonProps = Omit<
  ComponentProps<typeof Pressable>,
  "children" | "style"
> &
  ChildrenOrTitle & {
    variant?: ButtonVariant;
    backgroundColor?: ThemeColor;
    style?: StyleProp<ViewStyle>;
    defaultStyle?: StyleProp<ViewStyle>;
    pressedStyle?: StyleProp<ViewStyle>;
    fontColor?: string;
  };

function StyledButton(
  {
    backgroundColor,
    style,
    defaultStyle,
    pressedStyle,
    fontColor,
    children,
    title,
    variant,
    ...props
  }: StyledButtonProps,
  ref
) {
  let fillColor: ThemeColor = "primary";

  if (variant) {
    fillColor = variant === "filled" ? "primary" : "background";
  }

  const buttonColor = useThemeColor(backgroundColor || fillColor);
  const pressedColor = useThemeColor(backgroundColor || fillColor);
  const borderColor = useThemeColor("primary");

  return (
    <Pressable
      ref={ref}
      style={({ pressed }) => {
        let buttonStyles: StyleProp<ViewStyle> = [
          styles.container,
          {
            borderColor,
            borderWidth: 2,
          },
          style,
        ];

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

export default forwardRef(StyledButton);
