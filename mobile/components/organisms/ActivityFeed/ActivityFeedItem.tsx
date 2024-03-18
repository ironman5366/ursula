import React from "react";
import { Activity } from "@ursula/shared-types/derived.ts";
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
    <ListItem icon={<ProfileImage profile={profile} width={30} height={30} />}>
      <ActivityContent activity={activity} profile={profile} />
    </ListItem>
  );
}
