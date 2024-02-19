import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { ThemedView } from "../../components/organisms/Themed.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import { useCurrentUserReviews } from "../../hooks/reviews.ts";
import BookRankRow from "./BookRankRow.tsx";

export default function RankingList() {
  const { data: reviews } = useCurrentUserReviews();
  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={({ index, item: review }) => (
          <BookRankRow review={review} rank={index + 1} />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
