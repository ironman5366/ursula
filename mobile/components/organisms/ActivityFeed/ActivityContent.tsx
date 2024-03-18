import React from "react";
import { Activity, ActivityOf, Profile } from "@ursula/shared-types/derived.ts";
import {
  ActivityType,
  StartedReadingActivity,
} from "@ursula/shared-types/Activity.ts";
import { StyledText } from "../../atoms/StyledText.tsx";
import BookLink from "../../atoms/BookLink.tsx";

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
      <BookLink book_id={activity.data.book_id} />
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
  }
}
