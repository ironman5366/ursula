import React, { useEffect, useState } from "react";
import { useCurrentUserReviews } from "../../hooks/reviews.ts";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useUpdateProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import { YStack } from "tamagui";
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import BookRankRow from "../../components/molecules/BookRankRow.tsx";

export default function RankingList() {
  const { data: reviews, isLoading } = useCurrentUserReviews();
  const { mutate: updateProfile } = useUpdateProfile();
  const [hotReviews, setHotReviews] = useState<ReviewWithBook[]>([]);
  const reviewsSerialized = JSON.stringify(reviews);

  useEffect(() => {
    if (reviews && reviews.length > 1) {
      setHotReviews(reviews);
    }
  }, [reviewsSerialized]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <YStack width="100%" flexGrow={3} flex={4}>
      <DraggableFlatList
        style={{ height: "100%" }}
        keyExtractor={(item) => item.review.id.toString()}
        data={hotReviews}
        renderItem={({ item: review, getIndex, drag }) => {
          const index = getIndex();
          return <BookRankRow review={review} rank={index + 1} drag={drag} />;
        }}
        onDragEnd={({ data }) => {
          setHotReviews(data);
          const orderedReviewIds = data.map((review) => review.review.id);
          updateProfile({
            review_ids: [...orderedReviewIds],
          });
        }}
      />
    </YStack>
  );
}
