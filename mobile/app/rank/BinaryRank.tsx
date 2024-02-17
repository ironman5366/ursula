import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Book, Profile } from "@ursula/shared-types/derived.ts";
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import useBinarySearch from "../../hooks/useBinarySearch.ts";

interface Props {
  profile: Profile;
  reviewTarget: ReviewWithBook;
  existingReviews: ReviewWithBook[];
}

export default function BinaryRank({ reviewTarget, existingReviews }: Props) {
  const { curr, right, left, finished, currIdx } =
    useBinarySearch(existingReviews);

  useEffect(() => {
    // Insert the book at currIdx
  }, [finished, currIdx]);

  useEffect(() => {}, [finished]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
