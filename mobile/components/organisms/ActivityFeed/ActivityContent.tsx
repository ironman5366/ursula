import React from "react";
import { Activity, ActivityOf, Profile } from "@ursula/shared-types/derived.ts";
import {
  ActivityType,
  RankedActivity,
  StartedReadingActivity,
} from "@ursula/shared-types/Activity.ts";
import { StyledText } from "../../atoms/StyledText.tsx";
import { Link } from "expo-router";
import StyledButton from "../StyledButton.tsx";

interface Props<T> {
  activity: T;
  profile: Profile;
}

function StartedReadingContent({
  activity,
  profile,
}: Props<ActivityOf<StartedReadingActivity>>) {
  return (
    <StyledText>
      {profile.full_name} started reading{" "}
      <Link href={`/bookDetail/${activity.data.book_id}`}>
        {activity.data.book_name}
      </Link>
    </StyledText>
  );
}

function RankedContent({
  activity,
  profile,
}: Props<ActivityOf<RankedActivity>>) {
  return (
    <StyledText>
      {profile.full_name} started ranked{" "}
      <Link href={`/bookDetail/${activity.data.book_id}/`}>
        {activity.data.book_name}
      </Link>{" "}
      as {activity.data.rank} out of {activity.data.total} books read.
    </StyledText>
  );
}

export default function ActivityContent<T extends Activity>({
  activity,
  profile,
}: Props<T>) {
  switch (activity.type) {
    case ActivityType.STARTED_READING:
      return <StartedReadingContent activity={activity} profile={profile} />;
    case ActivityType.RANKED:
      return <RankedContent activity={activity} profile={profile} />;
    default:
      return <StyledText>TODO</StyledText>;
  }
}
