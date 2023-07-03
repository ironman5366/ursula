import React from "react";
import { TextInput, useColorScheme } from "react-native";
import { ThemeProps, useThemeColor } from "../organisms/Themed";

export default function SearchBar() {
  const tint = useThemeColor("tint");
  return (
    <TextInput
      style={{
        borderColor: tint,
        borderWidth: 3,
        width: "80%",
        borderRadius: 8,
      }}
    ></TextInput>
  );
}
