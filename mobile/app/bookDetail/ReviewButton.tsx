import { useUnrank, useUserBookReview } from "../../hooks/reviews.ts";
import CardButton from "../../components/atoms/CardButton.tsx";
import { ActivityIndicator } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useCurrentProfile } from "../../hooks/profile.ts";

interface Props {
  bookId: number;
}

export default function ReviewButton({ bookId }: Props) {
  const { data: review, isLoading: isReviewLoading } =
    useUserBookReview(bookId);
  const { data: profile } = useCurrentProfile();
  const { mutate: unrank, isLoading: isUnranking } = useUnrank();

  const isLoading = !profile || isReviewLoading || isUnranking;

  let buttonProps;
  if (isLoading) {
    buttonProps = {
      children: <ActivityIndicator />,
    };
  } else {
    buttonProps = {
      title: review ? "Remove from your reviews" : "Review",
    };
  }

  return (
    <CardButton
      onPress={() => {
        if (review) {
          unrank({ profile, reviewId: review.id });
        } else {
          router.push(`/review/${bookId}/`);
        }
      }}
      disabled={isLoading}
      {...buttonProps}
    />
  );
}
