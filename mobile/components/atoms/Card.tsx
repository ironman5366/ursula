import React from "react";
import { ThemedView, ViewProps } from "../organisms/Themed";
import { StyleSheet } from "react-native";

export default function Card(props: ViewProps) {
  return (
    <ThemedView style={[props.style, styles.card]}>{props.children}</ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#000",
    shadowRadius: 2,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
