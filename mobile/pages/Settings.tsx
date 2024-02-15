import React from "react";
import { Button, StyleSheet } from "react-native";
import { supabase } from "../utils/supabase.ts";
import { ThemedView } from "../components/organisms/Themed.tsx";

export default function Settings() {
  return (
    <ThemedView style={styles.container}>
      <Button
        title={"Sign Out"}
        onPress={() => {
          console.log("Signing out...");
          supabase.auth.signOut();
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
