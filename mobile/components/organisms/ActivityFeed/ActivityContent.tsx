import React from "react";
import { Activity, ActivityOf, Profile } from "@ursula/shared-types/derived.ts";
import {
  ActivityType,
  AddedToListActivity,
  RankedActivity,
  StartedReadingActivity,
} from "@ursula/shared-types/Activity.ts";
import { StyledText } from "../../atoms/StyledText.tsx";
import { Link } from "expo-router";

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
      {profile.full_name} ranked{" "}
      <StyledLink href={`/bookDetail/${activity.data.book_id}/`}>
        {activity.data.book_name}
      </StyledLink>{" "}
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
      <StyledLink href={`/bookDetail/${activity.data.book_id}/`}>
        {activity.data.book_name}
      </StyledLink>{" "}
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

//create a custom link component that uses the expo-router Link component, accepts all the same props, forwards the ref, and adds a style prop

export function StyledLink({
  style,
  href,
  ...props
}: React.ComponentProps<typeof Link> & { style?: any; href: string }) {
  return (
    <Link
      href={href}
      {...props}
      style={[
        style,
        {
          fontWeight: "bold",
          color: "#035487",
        },
      ]}
    />
  );
}
