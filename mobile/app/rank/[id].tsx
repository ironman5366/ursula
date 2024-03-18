import React from "react";
import useNumericIdParam from "../../hooks/useIdParam.ts";
import { StyleSheet } from "react-native";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import BinaryRank from "./BinaryRank.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import { useCurrentUserReviews, useReview } from "../../hooks/reviews.ts";
import { StyledView } from "../../components/organisms/StyledView.tsx";

export default function Rank() {
  const id = useNumericIdParam();
  const { data: review } = useReview(id);
  const { data: profile } = useCurrentProfile();
  const { data: existingReviews } = useCurrentUserReviews();

  if (!(profile && existingReviews && review)) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StyledView style={styles.container}>
        <BinaryRank
          profile={profile}
          reviewTarget={review}
          existingReviews={existingReviews}
        />
      </StyledView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
