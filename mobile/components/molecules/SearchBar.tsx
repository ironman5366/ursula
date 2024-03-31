import { Search } from "@tamagui/lucide-icons";
import React from "react";
import { TextInput } from "react-native";
import StyledInput from "../../atoms/StyledInput.tsx";

interface SearchBarProps
  extends Omit<
    React.ComponentProps<typeof TextInput>,
    "style" | "placeholder" | "onChange" | "onChangeText" | "value"
  > {
  value?: string;
  // Must provide onChangeText, can't use onChange
  onChangeText?: (text: string) => void;
  editable: boolean;
}

export default function SearchBar({ editable, ...props }: SearchBarProps) {
  const value = props.value || "";
  const onChangeText = props.onChangeText || (() => {});

  return (
    <StyledInput
      caretHidden={false}
      placeholder={"Search"}
      onChangeText={onChangeText}
      autoFocus={editable}
      value={value}
      icon={<Search />}
      {...props}
    />
  );
}
