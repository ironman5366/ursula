import React from "react";
import { Text } from "react-native";
import SearchContainer from "../../components/containers/SearchContainer.tsx";
import { Tabs } from "expo-router";
import TabBarIcon from "../../components/atoms/TabBarIcon.tsx";
import { useSocialFeed } from "../../hooks/activities.ts";
import ActivityFeed from "../../components/organisms/ActivityFeed/ActivityFeed.tsx";

export default function Home() {
  const { data: socialFeed } = useSocialFeed();

  return (
    <SearchContainer editable={false}>
      <Tabs.Screen
        options={{
          title: "Ursula",
          tabBarLabel: "Home",
        }}
      />
      <ActivityFeed activities={socialFeed} />
    </SearchContainer>
  );
}
