import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "../components/organisms/Themed";
import { ActivityIndicator } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import useRankedReviews from "../hooks/useRankedReviews";
import useVolume from "../hooks/useVolume";
import VolumePreviewCard from "../components/molecules/VolumePreviewCard";
import { ReviewRow } from "../types/derived";
import useReview from "../hooks/useReview";
import ReviewComparison from "../components/organisms/ReviewComparison";

export default function Review() {
  const navigation = useNavigation();

  // Fetch the existing reviews
  const { data } = useRankedReviews();

  // Get the details of the book being reviewed
  const params = useLocalSearchParams();
  const isbn: number = Number.parseInt(params.isbn as string);

  // Prepare to insert the book into the reviews table
  const { mutate, isSuccess, isLoading: isMutationLoading } = useReview();
  useEffect(() => {
    // Once the mutation is successful, go home
    // @ts-ignore
    navigation.navigate("(tabs)");
  }, [isSuccess]);

  // TODO: go through an example of a successful search, once validated
  // Keep track of the information we need for the binary search - the *comparator* is the book that's currently being
  // compared to the book being reviewed
  const [comparatorIdx, setComparatorIdx] = useState<number>();
  const comparator = useMemo(() => {
    if (comparatorIdx !== undefined && data?.data) {
      return data.data[comparatorIdx];
    }
  }, [comparatorIdx, data]);
  const [comparisonRange, setComparisonRange] = useState<[number, number]>();
  // Keep track of the most recent base of comparison, in case we have to store it in prevReviewId
  const [prevComparator, setPrevComparator] = useState<[number, ReviewRow]>();

  useEffect(() => {
    if (data?.data) {
      const midpoint = data.data.length;
      const idx = Math.floor(midpoint / 2);
      setComparatorIdx(idx);
      setComparisonRange([0, data.data.length - 1]);
    }
  }, [data]);

  const nextComparator = useCallback(
    (comparatorPreferred: boolean) => {
      if (
        comparatorIdx !== undefined &&
        comparator &&
        data?.data &&
        comparisonRange
      ) {
        let range = comparisonRange;

        if (comparatorPreferred) {
          setComparisonRange((currRange) => [currRange[0], comparatorIdx]);
          // If the comparator was better than the book being reviewed, the next book up for comparison will be one
          // *lower* on the user's list
          const distance = data.data.length - 1 - comparatorIdx;

          // If distance is 0, this was the *end* of the list. prev_review_id is the current comparator, and this is
          // the worst book on our list :(
          if (distance === 0) {
            mutate({
              prevReviewId: comparator.id,
              isbn,
            });
          } else {
            // Otherwise, go down further towards the end of the list
            const midpoint = comparatorIdx + Math.floor(distance / 2);
            setPrevComparator([comparatorIdx, comparator]);
            setComparatorIdx(midpoint);
          }
        } else {
          // If the comparator was worse than the book being reviewed, look at a book *higher* on the users' list.
          // distance == comparatorIdx, because it's the distance to 0.
          const distance = comparatorIdx;

          //
          if (distance == 0) {
          }
        }

        setPrevComparator([comparatorIdx, comparator]);
      }
    },
    [comparatorIdx]
  );

  if (!data?.data || isMutationLoading || !comparator) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ReviewComparison
      reviewTargetISBN={isbn}
      onReviewTargetPressed={() => nextComparator(false)}
      comparatorISBN={comparator.isbn}
      onComparatorPressed={() => nextComparator(true)}
    />
  );
}
