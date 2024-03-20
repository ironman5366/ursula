import React from "react";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Settings2 } from "@tamagui/lucide-icons";
import { useThemeColor } from "../../theme.ts";

export default function SettingsButton() {
  const primaryColor = useThemeColor("primary");

  return (
    <Link
      href={"/settings"}
      asChild
      style={{
        padding: 5,
      }}
    >
      <Pressable>
        <Settings2 color={primaryColor} />
      </Pressable>
    </Link>
  );
}
