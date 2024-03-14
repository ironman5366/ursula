import React from "react";
import { Stack } from "expo-router";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import { StyleSheet } from "react-native";

export default function Profile() {
  return (
    <StyledView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Your Profile",
        }}
      />
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
