import React, { ComponentProps, forwardRef } from "react";
import { TextInput, StyleSheet } from "react-native";
import ThemeColor from "../../types/ThemeColor";
import { useThemeColor } from "../../theme.ts";

interface Props extends ComponentProps<typeof TextInput> {
  borderColorName?: ThemeColor;
}

function StyledInput({ borderColorName, style, ...props }: Props, ref) {
  const borderColor = useThemeColor(borderColorName || "tint");

  return (
    <TextInput
      ref={ref}
      style={[styles.input, { borderColor }, style || {}]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    padding: 5,
    borderRadius: 5,
  },
});

export default forwardRef(StyledInput);
