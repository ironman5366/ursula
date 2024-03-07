import React from "react";
import { Text } from "react-native";
import SearchContainer from "../../components/containers/SearchContainer.tsx";
import { Tabs } from "expo-router";
import TabBarIcon from "../../components/atoms/TabBarIcon.tsx";

export default function Home() {
  return (
    <SearchContainer editable={false}>
      <Tabs.Screen
        options={{
          title: "Ursula",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Text>TODO: home heresuck my toe</Text>
    </SearchContainer>
  );
}
