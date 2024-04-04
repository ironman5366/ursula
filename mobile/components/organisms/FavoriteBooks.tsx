import React from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { useReviews } from "../../hooks/reviews.ts";
import { ActivityIndicator, FlatList } from "react-native";
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
    <FlatList
      data={reviews}
      scrollEnabled={true}
      renderItem={({ item: review, index }) => (
        <BookRankRow rank={index + 1} review={review} key={index} />
      )}
    />
  );
}
