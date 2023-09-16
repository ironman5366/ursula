import React from "react";
import { Text, View } from "./Themed";

interface Props {
  reviewTargetISBN: number;
  onReviewTargetPressed: () => void;
  comparatorISBN: number;
  onComparatorPressed: () => void;
}

export default function ReviewComparison({
  reviewTargetISBN,
  onReviewTargetPressed,
  comparatorISBN,
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
        <ISBNPreviewCard
          isbn={reviewTargetISBN}
          imageSize={100}
          onPress={onReviewTargetPressed}
        />
        <ISBNPreviewCard
          isbn={comparatorISBN}
          imageSize={100}
          onPress={onComparatorPressed}
        />
      </View>
    </View>
  );
}
