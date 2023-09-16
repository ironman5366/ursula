import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigation } from "expo-router";
import useRankedReviews from "../hooks/useRankedReviews";
import useIdParam from "../hooks/useIdParam";
import useInsertReview from "../hooks/useInsertReview";
import { ActivityIndicator } from "react-native";
import { View } from "../components/organisms/Themed";
import ReviewComparison from "../components/organisms/ReviewComparison";

export default function Review() {
  const navigation = useNavigation();

  // The book being reviewed
  const isbn = useIdParam();

  // All the existing reviews
  const { data } = useRankedReviews();

  // The mutation that will let us actually add this review to the database when we're done comparing it to other books
  const { mutate, isLoading, isSuccess, isError, error } = useInsertReview();

  useEffect(() => {
    if (isSuccess) {
      // @ts-ignore
      navigation.navigate("(tabs)");
    }
  }, [isSuccess]);

  // The state we need to keep track of for the binary search:
  // 1. The current range of the search. Must be initialized after we fetch the reviews, starts at [0, length - 1]
  const [comparisonRange, setComparisonRange] = useState<[number, number]>();
  // 2. The index of the current target of comparison
  const [comparatorIdx, setComparisonIdx] = useState<number>();
  // 3. The actual row with the data of the current comparator
  const comparator = useMemo(() => {
    if (data?.data && comparatorIdx !== undefined) {
      return data.data[comparatorIdx];
    }
  }, [data, comparatorIdx]);

  // Once the existing reviews are done loading, initialize the state
  useEffect(() => {
    if (data?.data) {
      // If there are no previous reviews, insert this!
      if (data.data.length === 0) {
        mutate({
          isbn,
        });
      } else {
        // Otherwise, start the binary search through the books
        setComparisonRange([0, data.data.length]);
        const midpoint = Math.floor(data.data.length / 2);
        setComparisonIdx(midpoint);
      }
    }
  }, [data]);

  const stateInitialized = comparator !== undefined &&
    comparatorIdx !== undefined &&
    data?.data &&
    comparisonRange;

  // This callback will let us change the comparison when the user clicks on one book or another.
  // The `comparatorPreferred` boolean toggle indicates whether the book that was chosen is the comparator. When it's
  // true, we'll go down the list, and when it's false we'll go up for the next comparator
  const nextBook = useCallback(
    (comparatorPreferred: boolean) => {
      if (stateInitialized) {
        let newRange = comparisonRange;
        if (comparatorPreferred) {
          newRange[0] = comparatorIdx;
        } else {
          newRange[1] = comparatorIdx;
        }
        console.log(
          "Comparator preferred ",
          comparatorPreferred,
          " range going from ",
          comparisonRange,
          " to ",
          newRange,
        );

        const distance = newRange[1] - newRange[0];
        // If the distance is 0, we're done searching! We can insert a rank
        if (distance === 0) {
          // If they said they preferred the comparator to this most recent book, the most recent book needs to have a
          // prevReviewId of the comparator.
          if (comparatorPreferred) {
            mutate({
              isbn,
              prev_review_id: comparator.id,
            });
          } else {
            let prevReviewId;
            if (comparatorIdx === 0) {
              prevReviewId = null;
            } else {
              prevReviewId = data.data[comparatorIdx - 1].id;
            }
            // Otherwise, it's the other way around. If it's the other way around,
            // we have to do two mutations! We not only have to insert this book, we have to update the comparator to
            // mark this book as it's prevReviewId
            mutate({
              isbn,
              prev_review_id: prevReviewId,
              alter_review_id: comparator.id,
            });
          }
        } else {
          const midpoint = newRange[0] + Math.floor(distance / 2);
          setComparisonRange(newRange);
          setComparisonIdx(midpoint);
        }
      } else {
        // We should never see this
        throw new Error("Comparison state uninitialized in nextBook");
      }
    },
    [comparisonRange, comparatorIdx],
  );

  if (isLoading || !stateInitialized) {
    console.log("Loading", isLoading, data, comparator, comparatorIdx);
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <ReviewComparison
      reviewTargetISBN={isbn}
      onReviewTargetPressed={() => nextBook(false)}
      comparatorISBN={comparator.isbn}
      onComparatorPressed={() => nextBook(true)}
    />
  );
}
