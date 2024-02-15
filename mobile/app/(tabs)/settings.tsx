import React from "react";
import { Button, StyleSheet } from "react-native";
import { ThemedView } from "../../components/organisms/Themed.tsx";
import { supabase } from "../../utils/supabase.ts";

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
