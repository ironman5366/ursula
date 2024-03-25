import React from "react";
import { Activity } from "@ursula/shared-types/derived.ts";
import { ActivityIndicator, FlatList, StatusBar, StyleSheet } from "react-native";
import ActivityFeedItem from "./ActivityFeedItem.tsx";
import { StyledText } from "../../atoms/StyledText.tsx";
import { TitleText } from "../../atoms/TitleText.tsx";
import { XStack, YStack } from "tamagui";

interface Props {
  activities: Activity[] | null | undefined;
}

export default function ActivityFeed({ activities }: Props) {
  if (activities === null || activities === undefined) {
    return <ActivityIndicator size={"small"} />;
  }

  return (
    <YStack>
      {activities.length > 0 ? (
        <FlatList
          data={activities}
          contentContainerStyle={{ paddingBottom: 200 }}
          renderItem={({ item, index }) => (
            <ActivityFeedItem activity={item} key={index} />
          )}
        />
      ) : (
        <StyledText>
          No activities yet. Be the first to share what you're reading!
        </StyledText>
      )}
    </YStack>
  );
}


