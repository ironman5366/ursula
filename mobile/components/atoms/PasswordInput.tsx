import React, { ComponentProps } from "react";
import StyledInput from "./StyledInput";
import { Input } from "tamagui";

type Props = Omit<
  ComponentProps<typeof Input>,
  "autoCapitalize" | "autoComplete" | "keyboardType" | "textContentType"
>;

export default function PasswordInput(props: Props) {
  return (
    <Input
      {...props}
      secureTextEntry
      autoCapitalize={"none"}
      autoComplete="password"
      textContentType="password"
    />
  );
}
