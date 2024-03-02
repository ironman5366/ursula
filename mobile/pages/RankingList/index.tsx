import React from "react";
import { StyleSheet } from "react-native";
import { useCurrentUserReviews } from "../../hooks/reviews.ts";
import BookRankRow from "./BookRankRow.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import DraggableFlatList from "react-native-draggable-flatlist";
import { useUpdateProfile } from "../../hooks/profile.ts";

export default function RankingList() {
  const { data } = useCurrentUserReviews();
  const { mutate: updateProfile } = useUpdateProfile();

  const reviews = data || [];

  return (
    <StyledView style={styles.container}>
      <StyledView
        style={{
          flex: 0.9,
        }}
      >
        <DraggableFlatList
          keyExtractor={(item) => item.review.id.toString()}
          data={reviews}
          renderItem={({ item: review, getIndex, drag }) => {
            const index = getIndex();
            return <BookRankRow review={review} rank={index + 1} drag={drag} />;
          }}
          onDragEnd={({ data }) => {
            const orderedReviewIds = data.map((review) => review.review.id);
            console.log("updating ranks with ", orderedReviewIds);
            updateProfile({
              review_ids: orderedReviewIds,
            });
          }}
        />
      </StyledView>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
