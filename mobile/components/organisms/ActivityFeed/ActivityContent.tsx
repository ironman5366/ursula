import {
  ActivityType,
  AddedToListActivity,
  RankedActivity,
  StartedReadingActivity,
} from "@ursula/shared-types/Activity.ts";
import { Activity, ActivityOf, Profile } from "@ursula/shared-types/derived.ts";
import React from "react";
import { StyledLink } from "../../atoms/StyledLink.tsx";
import { StyledText } from "../../atoms/StyledText.tsx";
import { BookLink } from "../../atoms/BookLink.tsx";
import { Book } from "@tamagui/lucide-icons";

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
      {profile.full_name} started reading {/* @ts-ignore */}
      <StyledLink href={`/bookDetail/${activity.data.book_id}`}>
        {activity.data.book_name}
      </StyledLink>
    </StyledText>
  );
}

function RankedContent({
  activity,
  profile,
}: Props<ActivityOf<RankedActivity>>) {
  return (
    <StyledText>
      {profile.full_name} ranked {/* @ts-ignore */}
      <BookLink book={{ id: activity.data.book_id }}>
        {activity.data.book_name}
      </BookLink>
      as {activity.data.rank} out of {activity.data.total} books read.
    </StyledText>
  );
}

function AddedToListContent({
  activity,
  profile,
}: Props<ActivityOf<AddedToListActivity>>) {
  return (
    <StyledText>
      {profile.full_name} added{" "}
      <BookLink
        book={{
          id: activity.data.book_id,
          title: activity.data.book_name,
        }}
      />
      to their reading list.
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
    case ActivityType.ADDED_TO_LIST:
      return <AddedToListContent activity={activity} profile={profile} />;
    default:
      return <StyledText>TODO</StyledText>;
  }
}
