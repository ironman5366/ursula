import {
  ActivityType,
  AddedToListActivity,
  FollowedActivity,
  JoinedActivity,
  PostedNoteActivity,
  RankedActivity,
  RecommendedActivity,
  StartedReadingActivity,
} from "@ursula/shared-types/Activity.ts";
import { Activity, ActivityOf, Profile } from "@ursula/shared-types/derived.ts";
import React from "react";
import { StyledLink } from "../../atoms/StyledLink.tsx";
import { StyledText } from "../../atoms/StyledText.tsx";
import { BookLink } from "../../atoms/book/BookLink.tsx";
import ProfileLink from "../../atoms/profile/ProfileLink.tsx";
import { useSession } from "../../../contexts/SessionContext.ts";
import { Quote } from "@tamagui/lucide-icons";

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
      {activity.data.note && (
        <>
          <Quote />
          <StyledText
            style={{
              fontStyle: "italic",
            }}
          >
            {activity.data.note}
          </StyledText>
        </>
      )}
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

function JoinedContent({
  activity,
  profile,
}: Props<ActivityOf<JoinedActivity>>) {
  const { session } = useSession();
  const isOwnProfile = session?.user.id === activity.data.user_id;

  if (isOwnProfile) {
    return <StyledText>You joined Ursula. Welcome to the party!</StyledText>;
  } else {
    return (
      <StyledText>
        <ProfileLink profile={profile} /> joined Ursula. Say hi!
      </StyledText>
    );
  }
}

function FollowedContent({
  activity,
  profile,
}: Props<ActivityOf<FollowedActivity>>) {
  const { session } = useSession();
  const isOwnProfile = session?.user.id === activity.data.user_id;

  return (
    <StyledText>
      <ProfileLink profile={profile} /> followed{" "}
      {isOwnProfile ? (
        "you!"
      ) : (
        <ProfileLink
          profile={{
            id: activity.data.user_id,
            full_name: activity.data.full_name,
          }}
        />
      )}
    </StyledText>
  );
}

function PostedNoteContent({
  activity,
  profile,
}: Props<ActivityOf<PostedNoteActivity>>) {
  return (
    <StyledText>
      <ProfileLink profile={profile} /> posted a note about{" "}
      <BookLink
        book={{
          id: activity.data.book_id,
          title: activity.data.book_name,
        }}
      />
      <Quote />
      <StyledText
        style={{
          fontStyle: "italic",
        }}
      >
        {activity.data.note}
      </StyledText>
    </StyledText>
  );
}

function RecommendedContent({
  activity,
  profile,
}: Props<ActivityOf<RecommendedActivity>>) {
  const { session } = useSession();
  const isOwnProfile = session?.user.id === activity.data.recipient_id;

  return (
    <StyledText>
      <ProfileLink profile={profile} /> recommended{" "}
      <BookLink
        book={{
          id: activity.data.book_id,
          title: activity.data.book_name,
        }}
      />{" "}
      to{" "}
      {isOwnProfile ? (
        "you"
      ) : (
        <ProfileLink
          profile={{
            id: activity.data.recipient_id,
            full_name: activity.data.recipient_name,
          }}
        />
      )}
      {activity.data.note && (
        <>
          <Quote />
          <StyledText
            style={{
              fontStyle: "italic",
            }}
          >
            {activity.data.note}
          </StyledText>
        </>
      )}
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
    case ActivityType.JOINED:
      return <JoinedContent activity={activity} profile={profile} />;
    case ActivityType.FOLLOWED:
      return <FollowedContent activity={activity} profile={profile} />;
    case ActivityType.POSTED_NOTE:
      return <PostedNoteContent activity={activity} profile={profile} />;
    default:
      console.warn("Unknown activity type", activity.type, activity);
      return <></>;
  }
}
