import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useReadingList } from "../../hooks/readingList.ts";
import BookList from "../../components/molecules/BookList.tsx";
import { useSession } from "../../contexts/SessionContext.ts";

export default function ReadingList() {
  const { session } = useSession();
  const { data: readingList } = useReadingList(session.user.id);

  return (
    <View style={styles.container}>
      {readingList ? (
        <BookList books={readingList.map((r) => r.book)} />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
