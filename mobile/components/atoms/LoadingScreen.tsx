import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { StyledView } from "../organisms/StyledView.tsx";

export default function LoadingScreen() {
  return (
    <StyledView style={styles.container}>
      <ActivityIndicator />
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
