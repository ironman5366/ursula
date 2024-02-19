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
  const { curr, right, left, finished, currIdx } =
    useBinarySearch(existingReviews);
  const { mutate: rank } = useRank({
    onSuccess: () => {
      router.replace("/yourBooks");
    },
  });

  useEffect(() => {
    // Insert the book at currIdx
    if (finished) {
      console.log("ranking because finished");
      rank({
        review: reviewTarget.review,
        rankIdx: currIdx,
        profile,
      });
    }
  }, [finished]);

  // If we're finished, we're just waiting for the update to the profile, and
  // we'll be redirected after
  if (finished) {
    return <LoadingScreen />;
  }

  console.log("Returning rank comparison with ", reviewTarget, curr);

  return (
    <RankComparison
      reviewTarget={reviewTarget.book}
      onReviewTargetPressed={left}
      comparator={curr.book}
      onComparatorPressed={right}
    />
  );
}
