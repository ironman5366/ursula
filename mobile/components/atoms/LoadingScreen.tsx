import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedView } from "../organisms/Themed.tsx";

export default function LoadingScreen() {
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
