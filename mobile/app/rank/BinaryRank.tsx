import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Book, Profile } from "@ursula/shared-types/derived.ts";
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import useBinarySearch from "../../hooks/useBinarySearch.ts";
import { useUpdateProfile } from "../../hooks/profile.ts";

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

  // TODO: on success, navigate back to "your books"
  useEffect(() => {
    if (isSuccess) {
    }
  }, []);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
