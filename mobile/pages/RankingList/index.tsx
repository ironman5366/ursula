import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useCurrentUserReviews } from "../../hooks/reviews.ts";
import BookRankRow from "./BookRankRow.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useUpdateProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import { YStack } from "tamagui";
import { Review } from "@ursula/shared-types/derived.ts";
import ReviewWithBook from "../../types/ReviewWithBook.ts";

export default function RankingList() {
  const { data: reviews, isLoading } = useCurrentUserReviews();
  const { mutate: updateProfile } = useUpdateProfile();
  const [tempReviews, setTempReviews] = useState<ReviewWithBook[]>([]);
  const reviewsSerialized = JSON.stringify(reviews);

  console.log("review re-render");

  /*
  useEffect(() => {
    if (reviews && reviews.length > 1) {
      console.log("setting temp reviews");
      setTempReviews(reviews);
    }
  }, [reviewsSerialized]);

   */

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <YStack width="100%" flexGrow={3} flex={4}>
      <DraggableFlatList
        keyExtractor={(item) => item.review.id.toString()}
        data={reviews}
        renderItem={({ item: review, getIndex, drag }) => {
          const index = getIndex();
          return <BookRankRow review={review} rank={index + 1} drag={drag} />;
        }}
        onDragEnd={({ data }) => {
          const orderedReviewIds = data.map((review) => review.review.id);
          updateProfile({
            review_ids: [...orderedReviewIds],
          });
        }}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
