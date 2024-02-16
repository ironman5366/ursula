import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedView } from "../../components/organisms/Themed.tsx";
import useIdParam from "../../hooks/useIdParam.ts";
import useBook from "../../hooks/useBook.ts";
import { useCurrentProfile } from "../../hooks/useProfile.ts";

export default function Review() {
  const id = useIdParam();
  const { data: book } = useBook(id);
  const { data: profile } = useCurrentProfile();

  if (!book || !profile) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return <ThemedView style={styles.container}></ThemedView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
