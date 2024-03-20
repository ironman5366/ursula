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
  const primary = useThemeColor("primary");

  return (
    <StyledView
      style={{
        flex: 1,
        paddingRight: 10,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <ListItem
        icon={<ProfileImage profile={profile} size={30} />}
        style={{
          border: `1px solid ${primary}`,
        }}
      >
        {profile ? (
          <ActivityContent activity={activity} profile={profile} />
        ) : (
          <ActivityIndicator size={"small"} />
        )}
      </ListItem>
    </StyledView>
  );
}
