import React from "react";
import { View, ViewProps } from "../organisms/Themed";
import { StyleSheet } from "react-native";

export default function Card(props: ViewProps) {
  return <View style={[props.style, styles.card]}>{props.children}</View>;
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
