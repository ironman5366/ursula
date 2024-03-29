import React, { useEffect } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import ReviewWithBook from "../../../types/ReviewWithBook.ts";
import useBinarySearch from "../../../hooks/useBinarySearch.ts";
import { router } from "expo-router";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import RankComparison from "./RankComparison.tsx";
import { useRank } from "../../../hooks/reviews.ts";

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
  const { mutate: rank, isSuccess, isLoading } = useRank();

  const onFinished = (idx: number) => {
    rank({
      review: reviewTarget.review,
      rankIdx: idx,
      profile,
    });
  };

  const { curr, left, right } = useBinarySearch({
    items: existingReviews,
    onFinished,
  });

  useEffect(() => {
    if (isSuccess) {
      router.replace("/yourBooks");
    }
  }, [isSuccess]);

  useEffect(() => {
    // If this is the first book we're reviewing just insert it at 0
    if (existingReviews.length === 0) {
      onFinished(0);
    }
  }, [existingReviews]);

  // If we're finished, we're just waiting for the update to the profile, and
  // we'll be redirected after
  if (isLoading || !curr) {
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
