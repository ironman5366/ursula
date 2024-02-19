import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "../../components/organisms/Themed.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import BookPreviewRow from "../../components/molecules/BookPreviewRow.tsx";

interface Props {
  review: ReviewWithBook;
  rank: number;
}

export default function BookRankRow({ rank, review }: Props) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.number}>
        <StyledText
          style={{
            fontWeight: "600",
          }}
        >
          # {rank}
        </StyledText>
      </ThemedView>
      <ThemedView style={styles.preview}>
        <BookPreviewRow book={review.book} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    flexDirection: "row",
    paddingRight: 10,
    paddingLeft: 5,
  },
  number: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    flex: 9,
  },
});
