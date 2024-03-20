import React, { ComponentProps, forwardRef } from "react";
import StyledInput from "./StyledInput";
import { Input } from "tamagui";

type Props = Omit<
  ComponentProps<typeof Input>,
  | "autoCapitalize"
  | "autoComplete"
  | "keyboardType"
  | "textContentType"
  | "autoCorrect"
>;

function EmailInput(props: Props, ref) {
  return (
    <Input
      {...props}
      ref={ref}
      autoCorrect={false}
      autoComplete={"email"}
      autoCapitalize={"none"}
    />
  );
}

export default forwardRef(EmailInput);
