import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useReadingList } from "../../hooks/readingList.ts";
import BookList from "../../components/molecules/BookList.tsx";
import { useSession } from "../../contexts/SessionContext.ts";
import { ThemedView } from "../../components/organisms/Themed.tsx";

export default function ReadingList() {
  const { session } = useSession();
  const { data: readingList } = useReadingList(session.user.id);

  return (
    <ThemedView style={styles.container}>
      {readingList ? (
        <BookList books={readingList.map((r) => r.book)} />
      ) : (
        <ActivityIndicator />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
