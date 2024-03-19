import React from "react";
import SearchContainer from "../../components/containers/SearchContainer.tsx";
import { Tabs } from "expo-router";
import { useSocialFeed } from "../../hooks/activities.ts";
import ActivityFeed from "../../components/organisms/ActivityFeed";
import { XStack, Text } from "tamagui";
import { SafeAreaView } from "react-native";
import { DefaultHeader } from "../../components/atoms/DefaultHeader.tsx";

export default function Home() {
  const { data: socialFeed } = useSocialFeed();

  return (
    <SearchContainer editable={false}>
      <Tabs.Screen
        options={{
          title: "Ursula",
          tabBarLabel: "Home",
          header: DefaultHeader,
        }}
      />
      <ActivityFeed activities={socialFeed} />
    </SearchContainer>
  );
}
