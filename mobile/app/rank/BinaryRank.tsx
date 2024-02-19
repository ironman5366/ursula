import React, { useEffect } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import useBinarySearch from "../../hooks/useBinarySearch.ts";
import { router } from "expo-router";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import RankComparison from "./RankComparison.tsx";
import { useRank } from "../../hooks/reviews.ts";

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
  const { curr, right, left, finished, currIdx, empty } =
    useBinarySearch(existingReviews);
  const { mutate: rank } = useRank({
    onSuccess: () => {
      router.replace("/yourBooks");
    },
  });

  useEffect(() => {
    // Insert the book at currIdx
    if (finished) {
      rank({
        review: reviewTarget.review,
        rankIdx: currIdx,
        profile,
      });
    }
  }, [finished]);

  useEffect(() => {
    if (empty) {
      rank({
        review: reviewTarget.review,
        rankIdx: 0,
        profile,
      });
    }
  }, [empty]);

  // If we're finished, we're just waiting for the update to the profile, and
  // we'll be redirected after
  if (finished || empty) {
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
