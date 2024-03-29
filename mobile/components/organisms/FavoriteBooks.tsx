import React, { useMemo } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { useReviews } from "../../hooks/reviews.ts";
import { ActivityIndicator, FlatList, ScrollView } from "react-native";
import BookRankRow from "../molecules/BookRankRow.tsx";
import { YStack } from "tamagui";

interface Props {
  profile: Profile;
}

export default function FavoriteBooks({ profile }: Props) {
  const { data: reviews, isLoading } = useReviews(profile.id);

  if (isLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <YStack>
      <FlatList
        data={reviews}
        scrollEnabled={false}
        renderItem={({ item: review, index }) => (
          <BookRankRow rank={index + 1} review={review} key={index} />
        )}
      />
    </YStack>
  );
}