import React from "react";
import { StyledText, ThemedView } from "./Themed";
import BookIdPreviewCard from "../atoms/BookIdPreviewCard";

interface Props {
  reviewTargetId: number;
  onReviewTargetPressed: () => void;
  comparatorId: number;
  onComparatorPressed: () => void;
}

export default function ReviewComparison({
  reviewTargetId,
  onReviewTargetPressed,
  comparatorId,
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
        <BookIdPreviewCard
          bookId={reviewTargetId}
          imageSize={100}
          onPress={onReviewTargetPressed}
        />
        <BookIdPreviewCard
          bookId={comparatorId}
          imageSize={100}
          onPress={onComparatorPressed}
        />
      </ThemedView>
    </ThemedView>
  );
}
