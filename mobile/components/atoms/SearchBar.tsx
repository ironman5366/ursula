import React from "react";
import { TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "../../theme.ts";

export default function SearchBar(
  props: Omit<React.ComponentProps<typeof TextInput>, "style" | "placeholder">
) {
  const tint = useThemeColor("tint");
  return (
    <View
      style={{
        borderColor: tint,
        borderWidth: 3,
        borderRadius: 8,
        width: "100%",
        padding: 8,
        flexDirection: "row",
      }}
    >
      <Ionicons name={"ios-search"} size={20} color={tint} />
      <TextInput
        style={{
          textAlign: "center",
        }}
        caretHidden={false}
        placeholder={"Search"}
        {...props}
      />
    </View>
  );
}
