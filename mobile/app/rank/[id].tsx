import React from "react";
import useIdParam from "../../hooks/useIdParam.ts";
import { StyleSheet } from "react-native";
import { ThemedView } from "../../components/organisms/Themed.tsx";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import BinaryRank from "./BinaryRank.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import { useCurrentUserReviews, useReview } from "../../hooks/reviews.ts";

export default function Rank() {
  const id = useIdParam();
  const { data: review } = useReview(id);
  const { data: profile, status } = useCurrentProfile();
  const { data: existingReviews } = useCurrentUserReviews();

  if (!(profile && existingReviews && review)) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ThemedView style={styles.container}>
        <BinaryRank
          profile={profile}
          reviewTarget={review}
          existingReviews={existingReviews}
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
