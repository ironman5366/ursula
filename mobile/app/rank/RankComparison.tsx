import React from "react";
import { ThemedView } from "../../components/organisms/Themed.tsx";
import { StyledText } from "../../components/atoms/StyledText.tsx";
import { Book } from "@ursula/shared-types/derived.ts";
import BookPreviewRow from "../../components/molecules/BookPreviewRow.tsx";

interface Props {
  reviewTarget: Book;
  onReviewTargetPressed: () => void;
  comparator: Book;
  onComparatorPressed: () => void;
}

export default function RankComparison({
  reviewTarget,
  onReviewTargetPressed,
  comparator,
  onComparatorPressed,
}: Props) {
  return (
    <ThemedView
      style={{
        flex: 3,
        alignItems: "center",
      }}
    >
      <StyledText
        style={{
          fontSize: 25,
        }}
      >
        Which book did you prefer?
      </StyledText>
      <ThemedView
        style={{
          flex: 2,
        }}
      >
        <BookPreviewRow
          book={reviewTarget}
          imageSize={100}
          onPress={onReviewTargetPressed}
        />
        <BookPreviewRow
          book={comparator}
          imageSize={100}
          onPress={onComparatorPressed}
        />
      </ThemedView>
    </ThemedView>
  );
}
