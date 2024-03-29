import React from "react";
import { Stack } from "expo-router";
import { useCurrentProfile } from "../../../hooks/profile.ts";
import LoadingScreen from "../../../components/atoms/loaders/LoadingScreen.tsx";
import ViewProfile from "../../../pages/Profile/View";

export default function YourProfile() {
  const { data: profile } = useCurrentProfile();

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      {profile ? <ViewProfile profile={profile} /> : <LoadingScreen />}
    </>
  );
}
