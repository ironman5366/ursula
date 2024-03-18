import React from "react";
import { Activity } from "@ursula/shared-types/derived.ts";
import { ActivityIndicator, FlatList } from "react-native";
import ActivityFeedItem from "./ActivityFeedItem.tsx";

interface Props {
  activities: Activity[] | null | undefined;
}

export default function ActivityFeed({ activities }: Props) {
  if (activities === null || activities === undefined) {
    return <ActivityIndicator size={"small"} />;
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
