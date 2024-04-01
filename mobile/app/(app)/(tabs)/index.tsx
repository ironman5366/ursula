import React from "react";
import { Tabs } from "expo-router";
import HomePage from "../../../pages/Home";

export default function Home() {
  return (
    <>
      <Tabs.Screen
        options={{
          title: "Ursula",
          tabBarLabel: "Home",
        }}
      />
      <HomePage />
    </>
  );
}
