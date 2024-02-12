import React, { ComponentProps } from "react";
import { TextInput, StyleSheet } from "react-native";
import ThemeColor from "../../types/ThemeColor";
import { useThemeColor } from "../organisms/Themed";

interface Props extends ComponentProps<typeof TextInput> {
  borderColorName?: ThemeColor;
}

export default function StyledInput({ borderColorName, ...props }: Props) {
  const borderColor = useThemeColor(borderColorName || "tint");

  return <TextInput style={[styles.input, { borderColor }]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    padding: 5,
    borderRadius: 5,
  },
});
