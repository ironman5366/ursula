import React from "react";
import { ThemedView } from "../../components/organisms/Themed.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import { Book } from "@ursula/shared-types/derived.ts";
import BookPreviewRow from "../../components/molecules/BookPreviewRow.tsx";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  reviewTarget: Book;
  onReviewTargetPressed: () => void;
  comparator: Book;
  onComparatorPressed: () => void;
}

function BookButton({ book, onPress }: { book: Book; onPress: () => void }) {
  return (
    <ThemedView style={styles.bookButton}>
      <Pressable onPress={onPress}>
        <BookPreviewRow book={book} />
      </Pressable>
    </ThemedView>
  );
}

export default function RankComparison({
  reviewTarget,
  onReviewTargetPressed,
  comparator,
  onComparatorPressed,
}: Props) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.buttonRow}>
        <BookButton book={reviewTarget} onPress={onReviewTargetPressed} />
        <BookButton book={comparator} onPress={onComparatorPressed} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonRow: {
    flex: 2,
    flexDirection: "row",
    padding: 10,
  },
  bookButton: {
    flex: 1,
  },
});
