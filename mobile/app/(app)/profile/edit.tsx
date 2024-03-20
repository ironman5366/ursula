import { Stack } from "expo-router";
import React from "react";
import LoadingScreen from "../../../components/atoms/LoadingScreen.tsx";
import { useCurrentProfile } from "../../../hooks/profile.ts";
import EditProfilePage from "../../../pages/Profile/Edit";

export default function EditProfile() {
  const { data: profile } = useCurrentProfile();

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerBackTitle: "Profile",
        }}
      />
      {profile ? <EditProfilePage profile={profile} /> : <LoadingScreen />}
    </>
  );
}
