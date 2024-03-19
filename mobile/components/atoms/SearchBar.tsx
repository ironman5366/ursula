import { Search, XCircle } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { TextInput } from "react-native";
import { Button, Input, XStack } from "tamagui";
import { useThemeColor } from "../../theme.ts";

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
  const tint = "gray";
  const textColor = useThemeColor("text");
  const placeholderColor = useThemeColor("disabled");

  const value = props.value || "";
  const onChangeText = props.onChangeText || (() => {});

  return (
    <XStack
      borderWidth={2}
      backgroundColor="#00000011"
      borderRadius={8}
      width="100%"
      p={8}
      borderColor="#00000022"
    >
      <Search size={20} color={tint} mr="$2" style={{ flex: 0.1 }} />
      <Input
        style={{
          color: textColor,
          flex: 0.9,
        }}
        autoFocus={true}
        caretHidden={false}
        placeholder={"Search"}
        onChangeText={onChangeText}
        unstyled
        backgroundColor="$colorTransparent"
        flexGrow={1}
        editable={editable}
        onPressIn={() => router.push("/search")}
        value={value}
        placeholderTextColor={placeholderColor}
        {...props}
      />
      {value && value.length > 0 && (
        <Button
          unstyled
          iconAfter={<XCircle size={20} color={tint} />}
          onPress={() => onChangeText("")}
        />
      )}
    </XStack>
  );
}
