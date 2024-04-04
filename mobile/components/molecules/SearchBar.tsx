import React, { forwardRef, useEffect } from "react";
import { Search } from "@tamagui/lucide-icons";
import { Pressable, TextInput, TouchableOpacity } from "react-native";
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

export default function SearchBar({ editable, ...props }: SearchBarProps, ref) {
  const value = props.value || "";
  const onChangeText = props.onChangeText || (() => {});

  return (
    <StyledView
      pointerEvents={editable ? "auto" : "none"}
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
        disabled={!editable}
        value={value}
        icon={<Search />}
        {...props}
      />
    </StyledView>
  );
}
