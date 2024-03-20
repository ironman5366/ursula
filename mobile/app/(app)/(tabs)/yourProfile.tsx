import React from "react";
import { Stack } from "expo-router";
import ProfilePage from "../../../pages/Profile/Edit";
import { useCurrentProfile } from "../../../hooks/profile.ts";
import LoadingScreen from "../../../components/atoms/LoadingScreen.tsx";
import ViewProfile from "../../../pages/Profile/View";
import SearchContainer from "../../../components/containers/SearchContainer.tsx";

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
