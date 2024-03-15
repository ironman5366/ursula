import React from "react";
import { Stack } from "expo-router";
import { useSession } from "../../contexts/SessionContext.ts";
import ProfilePage from "../../pages/ProfilePage.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";

export default function YourProfile() {
  const { data: profile } = useCurrentProfile();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Profile",
        }}
      />
      {profile ? <ProfilePage profile={profile} /> : <LoadingScreen />}
    </>
  );
}
