import React, { ComponentProps } from "react";
import StyledInput from "./StyledInput";

type Props = Omit<
  ComponentProps<typeof StyledInput>,
  "autoCapitalize" | "autoComplete" | "keyboardType" | "textContentType"
>;

export default function EmailInput(props: Props) {
  return (
    <StyledInput
      {...props}
      autoCapitalize="none"
      autoComplete="email"
      keyboardType="email-address"
      textContentType="emailAddress"
    />
  );
}
