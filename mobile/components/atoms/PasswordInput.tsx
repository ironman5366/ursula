import React, { ComponentProps } from "react";
import StyledInput from "./StyledInput";
import { Input } from "tamagui";
import { Lock } from "@tamagui/lucide-icons";

type Props = Omit<
  ComponentProps<typeof Input>,
  "autoCapitalize" | "autoComplete" | "keyboardType" | "textContentType"
>;

export default function PasswordInput(props: Props) {
  return (
    <StyledInput
      {...props}
      secureTextEntry
      icon={<Lock />}
      autoCapitalize={"none"}
      autoComplete="password"
      textContentType="password"
    />
  );
}
