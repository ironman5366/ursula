import { Activity } from "@ursula/shared-types/derived.ts";
import React from "react";
import { ActivityIndicator } from "react-native";
import { ListItem } from "tamagui";
import { useProfile } from "../../../hooks/profile.ts";
import ProfileImage from "../../atoms/ProfileImage.tsx";
import ActivityContent from "./ActivityContent.tsx";

interface Props {
  activity: Activity;
}

export default function ActivityFeedItem({ activity }: Props) {
  const { data: profile } = useProfile(activity.user_id);

  return (
    <ListItem
      icon={<ProfileImage profile={profile} size={30} />}
      pr="$10"
      justifyContent="flex-start"
      borderBottomWidth={1}
      py="$3"
      borderBottomColor="#00000022"
    >
      {profile ? (
        <ActivityContent activity={activity} profile={profile} />
      ) : (
        <ActivityIndicator size={"small"} />
      )}
    </ListItem>
  );
}
