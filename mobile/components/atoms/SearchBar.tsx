import { Search } from "@tamagui/lucide-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import { TextInput } from "react-native";
import StyledInput from "./StyledInput.tsx";

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
  const pathname = usePathname();


  return (
    <StyledInput
      onFocus={() => pathname !== "/search" && router.push("/search")}
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
