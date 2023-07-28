import useReviews from "./useReviews";
import { useMemo } from "react";
import { ReviewRow } from "../types/derived";

function rankReviews(reviews: ReviewRow[]): ReviewRow[] {
  let reviewsByReference: Map<number | null, ReviewRow> = new Map();
  reviews.forEach((r) => {
    reviewsByReference.set(r.prev_review_id, r);
  });

  let rankedReviews: ReviewRow[] = [];

  // We know this will always exist, because there's at least one item in the list, and the first review will always
  // have a null ReviewType
  let currReview = reviewsByReference.get(null) as ReviewRow;

  while (true) {
    rankedReviews.push(currReview);
    const nextReview = reviewsByReference.get(currReview.id);
    if (nextReview) {
      currReview = nextReview;
    } else {
      break;
    }
  }

  return rankedReviews;
}

export default function useRankedReviews() {
  const { data: reviews, ...rest } = useReviews();
  const rankedReviews = useMemo(() => {
    if (!reviews || !reviews.data) {
      return;
    }

    const { data, ...dataRest } = reviews;

    const rankedData = data.length === 0 ? [] : rankReviews(data);
    return {
      data: rankedData,
      ...dataRest,
    };
  }, [reviews]);

  return {
    data: rankedReviews,
    ...rest,
  };
}
