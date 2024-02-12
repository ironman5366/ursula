import React from "react";
import { TextInput, View } from "react-native";
import { useThemeColor } from "../organisms/Themed";
import Ionicons from "@expo/vector-icons/Ionicons";

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
        placeholder={"Search"}
        {...props}
      />
    </View>
  );
}
