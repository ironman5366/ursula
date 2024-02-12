import React, { ComponentProps } from "react";
import StyledInput from "./StyledInput";

type Props = Omit<
  ComponentProps<typeof StyledInput>,
  "autoCapitalize" | "autoComplete" | "keyboardType" | "textContentType"
>;

export default function PasswordInput(props: Props) {
  return (
    <StyledInput
      {...props}
      secureTextEntry
      autoCapitalize={"none"}
      autoComplete="password"
      textContentType="password"
    />
  );
}
