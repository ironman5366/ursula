import React from "react";
import { Stack } from "expo-router";
import ProfilePage from "../../pages/ProfilePage";
import { useCurrentProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";

export default function YourProfile() {
  const { data: profile } = useCurrentProfile();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Profile",
        }}
      />
      {profile ? <ProfilePage profile={profile} /> : <LoadingScreen />}
    </>
  );
}
