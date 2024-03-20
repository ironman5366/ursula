import React from "react";
import { Activity } from "@ursula/shared-types/derived.ts";
import { ListItem } from "tamagui";
import { useProfile } from "../../../hooks/profile.ts";
import ProfileImage from "../../atoms/ProfileImage.tsx";
import ActivityContent from "./ActivityContent.tsx";
import { ActivityIndicator } from "react-native";
import { useThemeColor } from "../../../theme.ts";
import { StyledView } from "../StyledView.tsx";

interface Props {
  activity: Activity;
}

export default function ActivityFeedItem({ activity }: Props) {
  const { data: profile } = useProfile(activity.user_id);

  return (
    <ListItem
      icon={<ProfileImage profile={profile} size={30} />}
      borderRadius={20}
      style={{
        paddingRight: 50,
        justifyContent: "left",
      }}
    >
      {profile ? (
        <ActivityContent activity={activity} profile={profile} />
      ) : (
        <ActivityIndicator size={"small"} />
      )}
    </ListItem>
  );
}
