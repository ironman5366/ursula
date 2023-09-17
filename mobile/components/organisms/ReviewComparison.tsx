import React from "react";
import { Text, View } from "./Themed";
import BookPreviewCard from "../molecules/BookPreviewCard";
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
    <View
      style={{
        flex: 3,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 25,
        }}
      >
        Which book did you prefer?
      </Text>
      <View
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
      </View>
    </View>
  );
}
