import { Search } from "@tamagui/lucide-icons";
import React from "react";
import { TextInput } from "react-native";
import StyledInput from "../atoms/StyledInput.tsx";
import { StyledView } from "../organisms/StyledView.tsx";

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
    <StyledView
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        marginHorizontal: 10,
        justifyContent: "center",
      }}
    >
      <StyledInput
        caretHidden={false}
        placeholder={"Search"}
        onChangeText={onChangeText}
        autoFocus={editable}
        disabled={!editable}
        value={value}
        icon={<Search />}
        {...props}
      />
    </StyledView>
  );
}
