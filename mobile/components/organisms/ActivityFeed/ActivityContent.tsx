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
import { BookLink } from "../../atoms/book/BookLink.tsx";
import ProfileLink from "../../atoms/profile/ProfileLink.tsx";

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
      <ProfileLink profile={profile} /> started reading
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
      <ProfileLink profile={profile} /> ranked{" "}
      <BookLink
        book={{ id: activity.data.book_id, title: activity.data.book_name }}
      />{" "}
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
      <ProfileLink profile={profile} /> added{" "}
      <BookLink
        book={{
          id: activity.data.book_id,
          title: activity.data.book_name,
        }}
      />
      {"  "}
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
