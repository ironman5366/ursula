import React, { ComponentProps } from "react";
import { Button } from "react-native";
import { useThemeColor } from "../organisms/Themed";
import ThemeColor from "../../types/ThemeColor";

interface StyledButtonProps
  extends Omit<ComponentProps<typeof Button>, "color"> {
  colorName?: ThemeColor;
}

export default function StyledButton({
  colorName,
  ...props
}: StyledButtonProps) {
  const buttonColor = useThemeColor(colorName || "tint");
  return <Button color={buttonColor} {...props} />;
}
