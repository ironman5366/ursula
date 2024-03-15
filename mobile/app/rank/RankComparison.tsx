import React from "react";
import { Author, Book } from "@ursula/shared-types/derived.ts";
import { Button, Pressable, StyleSheet } from "react-native";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import CardButton from "../../components/atoms/CardButton.tsx";
import BookImage from "../../components/atoms/BookImage.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import StyledButton from "../../components/organisms/StyledButton.tsx";

interface Props {
  reviewTarget: Book;
  onReviewTargetPressed: () => void;
  comparator: Book;
  onComparatorPressed: () => void;
}

function BookComparisonCard({
  book,
  onPress,
}: {
  book: Book;
  onPress: () => void;
}) {
  return (
    <CardButton backgroundColor="background" onPress={onPress}>
      <StyledText>{book.title}</StyledText>
      <BookImage book={book} size={128} />
    </CardButton>
  );
}

export default function RankComparison({
  reviewTarget,
  onReviewTargetPressed,
  comparator,
  onComparatorPressed,
}: Props) {
  return (
    <StyledView style={styles.container}>
      <StyledText>Which book did you prefer?</StyledText>
      <StyledView style={styles.bookRow}>
        <BookComparisonCard
          book={reviewTarget}
          onPress={onReviewTargetPressed}
        />
        <BookComparisonCard book={comparator} onPress={onComparatorPressed} />
      </StyledView>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  bookRow: {
    flex: 0.3,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
