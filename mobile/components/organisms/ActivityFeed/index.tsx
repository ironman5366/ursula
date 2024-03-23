import React from "react";
import { Activity } from "@ursula/shared-types/derived.ts";
import { ActivityIndicator, FlatList } from "react-native";
import ActivityFeedItem from "./ActivityFeedItem.tsx";
import { StyledText } from "../../atoms/StyledText.tsx";
import { TitleText } from "../../atoms/TitleText.tsx";

interface Props {
  activities: Activity[] | null | undefined;
}

export default function ActivityFeed({ activities }: Props) {
  if (activities === null || activities === undefined) {
    return <ActivityIndicator size={"small"} />;
  }

  return (
    <>
      <TitleText>Activity Feed</TitleText>
      {activities.length > 0 ? (
        <FlatList
          data={activities}
          renderItem={({ item, index }) => (
            <ActivityFeedItem activity={item} key={index} />
          )}
        />
      ) : (
        <StyledText>
          No activities yet. Be the first to share what you're reading!
        </StyledText>
      )}
    </>
  );
}
