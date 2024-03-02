import React, { ComponentProps, forwardRef } from "react";
import StyledInput from "./StyledInput";

type Props = Omit<
  ComponentProps<typeof StyledInput>,
  | "autoCapitalize"
  | "autoComplete"
  | "keyboardType"
  | "textContentType"
  | "autoCorrect"
>;

function EmailInput(props: Props, ref) {
  return (
    <StyledInput
      {...props}
      ref={ref}
      autoCorrect={false}
      autoCapitalize="none"
      autoComplete="email"
      textContentType="emailAddress"
    />
  );
}

export default forwardRef(EmailInput);
