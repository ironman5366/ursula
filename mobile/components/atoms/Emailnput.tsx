import React, { ComponentProps, forwardRef } from "react";
import StyledInput from "./StyledInput";
import { Input } from "tamagui";
import { Mail } from "@tamagui/lucide-icons";

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
    <StyledInput
      {...props}
      ref={ref}
      icon={<Mail />}
      autoCorrect={false}
      autoComplete={"email"}
      autoCapitalize={"none"}
    />
  );
}

export default forwardRef(EmailInput);
