import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Book, Profile } from "@ursula/shared-types/derived.ts";
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import useBinarySearch from "../../hooks/useBinarySearch.ts";
import { useUpdateProfile } from "../../hooks/profile.ts";
import { router } from "expo-router";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import RankComparison from "./RankComparison.tsx";

interface Props {
  profile: Profile;
  reviewTarget: ReviewWithBook;
  existingReviews: ReviewWithBook[];
}

export default function BinaryRank({
  reviewTarget,
  existingReviews,
  profile,
}: Props) {
  const { curr, right, left, finished, currIdx } =
    useBinarySearch(existingReviews);
  const { mutate, isSuccess } = useUpdateProfile();

  useEffect(() => {
    // Insert the book at currIdx
    if (finished) {
      const newReviews = [...profile.review_ids];
      newReviews.splice(currIdx, 0, reviewTarget.review.id);
      // Update the profile
      mutate({ review_ids: newReviews });
      //
    }
  }, [finished]);

  useEffect(() => {
    if (isSuccess) {
      router.replace("/yourBooks");
    }
  }, [isSuccess]);

  // If we're finished, we're just waiting for the update to the profile, and
  // we'll be redirected after
  if (finished) {
    return <LoadingScreen />;
  }

  return (
    <RankComparison
      reviewTarget={reviewTarget.book}
      onReviewTargetPressed={left}
      comparator={curr.book}
      onComparatorPressed={right}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
