import React from "react";
import { Tabs } from "expo-router";
import { useSocialFeed } from "../../../hooks/activities.ts";
import ActivityFeed from "../../../components/organisms/ActivityFeed";
import SearchContainer from "../../../components/containers/SearchContainer";

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
