import React from "react";
import { StyleSheet } from "react-native";
import { useCurrentUserReviews } from "../../hooks/reviews.ts";
import BookRankRow from "./BookRankRow.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useUpdateProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";

export default function RankingList() {
  const { data: reviews, isLoading } = useCurrentUserReviews();
  const { mutate: updateProfile } = useUpdateProfile();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <StyledView style={styles.container}>
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
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
