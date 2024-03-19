import React from "react";
import { Activity } from "@ursula/shared-types/derived.ts";
import { ActivityIndicator, FlatList } from "react-native";
import ActivityFeedItem from "./ActivityFeedItem.tsx";
import { StyledText } from "../../atoms/StyledText.tsx";

interface Props {
  activities: Activity[] | null | undefined;
}

export default function ActivityFeed({ activities }: Props) {
  if (activities === null || activities === undefined) {
    return <ActivityIndicator size={"small"} />;
  }

  if (activities.length === 0) {
    return (
      <StyledText
        style={{
          padding: 10,
        }}
      >
        No activities yet. Be the first to share what you're reading!
      </StyledText>
    );
  }

  return (
    <FlatList
      data={activities}
      renderItem={({ item, index }) => (
        <ActivityFeedItem activity={item} key={index} />
      )}
    />
  );
}
