import React from "react";
import { Profile } from "@ursula/shared-types/derived.ts";
import { useActivities } from "../../hooks/activities.ts";
import { ActivityIndicator } from "react-native";
import ActivityFeed from "../organisms/ActivityFeed";
import { StyledText } from "../atoms/StyledText.tsx";

interface Props {
  profile: Profile;
}

export default function UserActivities({ profile }: Props) {
  const { data: activities, isLoading } = useActivities(profile.id);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return activities ? (
    <ActivityFeed activities={activities} />
  ) : (
    <StyledText>No Activities Yet</StyledText>
  );
}
