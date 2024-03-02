import React from "react";
import { TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "../../theme.ts";
import StyledButton from "../organisms/StyledButton.tsx";

interface SearchBarProps
  extends Omit<
    React.ComponentProps<typeof TextInput>,
    "style" | "placeholder" | "onChange" | "onChangeText" | "value"
  > {
  value?: string;
  // Must provide onChangeText, can't use onChange
  onChangeText?: (text: string) => void;
}

export default function SearchBar(props: SearchBarProps) {
  const tint = useThemeColor("tint");

  const value = props.value || "";
  const onChangeText = props.onChangeText || (() => {});

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            borderColor: tint,
            borderWidth: 3,
            borderRadius: 8,
            padding: 8,
          }}
        >
          <Ionicons name={"ios-search"} size={20} color={tint} />
          <TextInput
            style={{
              textAlign: "center",
            }}
            caretHidden={false}
            placeholder={"Search"}
            onChangeText={onChangeText}
            value={value}
            {...props}
          />
        </View>
        {value && value.length > 0 && (
          <View
            style={{
              paddingTop: 10,
              alignSelf: "center",
            }}
          >
            <StyledButton title={"Clear"} onPress={() => onChangeText("")} />
          </View>
        )}
      </View>
    </View>
  );
}
