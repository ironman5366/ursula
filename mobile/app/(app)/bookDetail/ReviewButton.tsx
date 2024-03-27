import { useUnrank, useUserBookReview } from "../../../hooks/reviews.ts";
import CardButton from "../../../components/atoms/CardButton.tsx";
import { ActivityIndicator } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useCurrentProfile } from "../../../hooks/profile.ts";
import { Button } from "tamagui";
import { PlusCircle, Star, StarOff } from "@tamagui/lucide-icons";

interface Props {
  bookId: number;
}

export default function ReviewButton({ bookId }: Props) {
  const { data: review, isLoading: isReviewLoading } =
    useUserBookReview(bookId);
  const { data: profile } = useCurrentProfile();
  const { mutate: unrank, isLoading: isUnranking } = useUnrank();

  const isLoading = !profile || isReviewLoading || isUnranking;

  return (
    <Button
      onPress={() => {
        if (review) {
          unrank({ profile, reviewId: review.id });
        } else {
          router.push(`/review/${bookId}/`);
        }
      }}
      disabled={isLoading}
      icon={
        isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : review ? (
          <StarOff size={20} color="white" />
        ) : (
          <Star size={20} color="white" />
        )
      }
      backgroundColor={
        review ? "maroon" : "black"
      }
      color="white"
    >
      {review ? "Remove Review" : " Review"}
    </Button>
  );
}
