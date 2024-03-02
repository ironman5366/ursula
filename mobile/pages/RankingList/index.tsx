import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { useCurrentUserReviews } from "../../hooks/reviews.ts";
import BookRankRow from "./BookRankRow.tsx";
import { StyledView } from "../../components/organisms/StyledView.tsx";

export default function RankingList() {
  const { data: reviews } = useCurrentUserReviews();
  return (
    <StyledView style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={({ index, item: review }) => (
          <BookRankRow review={review} rank={index + 1} />
        )}
      />
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
