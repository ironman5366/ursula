import React, { useEffect } from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
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

function BinaryRankInner({
  reviewTarget,
  existingReviews,
  rank,
}: Omit<Props, "profile"> & { rank: (rankIdx: number) => void }) {
  const { curr, right, left, finished, currIdx } =
    useBinarySearch(existingReviews);

  useEffect(() => {
    // Insert the book at currIdx
    if (finished) {
      rank(currIdx);
    }
  }, [finished]);

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

export default function BinaryRank({ profile, ...props }: Props) {
  const { mutate, isSuccess, isLoading } = useUpdateProfile();

  const rank = (rankIdx: number) => {
    const newReviews = [...profile.review_ids];
    newReviews.splice(rankIdx, 0, props.reviewTarget.review.id);
    // Update the profile
    mutate({ review_ids: newReviews });
  };

  useEffect(() => {
    if (isSuccess) {
      router.replace("/yourBooks");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (props.existingReviews.length === 0) {
      rank(0);
    }
  }, [props.existingReviews]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (props.existingReviews.length === 0) {
    return <LoadingScreen />;
  } else {
    return <BinaryRankInner rank={rank} {...props} />;
  }
}
