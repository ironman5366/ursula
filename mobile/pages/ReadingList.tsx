import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useReadingList } from "../hooks/readingList.ts";
import BookList from "../components/molecules/BookList.tsx";
import { useSession } from "../contexts/SessionContext.ts";
import { StyledView } from "../components/organisms/StyledView.tsx";

export default function ReadingList() {
  const { session } = useSession();
  const { data: readingList } = useReadingList(session.user.id);

  return (
    <StyledView style={styles.container}>
      {readingList ? (
        <BookList books={readingList.map((r) => r.book)} />
      ) : (
        <ActivityIndicator />
      )}
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    width: "100%",
  },
});
