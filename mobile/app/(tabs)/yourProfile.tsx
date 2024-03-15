import React from "react";
import { Stack } from "expo-router";
import { useSession } from "../../contexts/SessionContext.ts";
import ProfilePage from "../../pages/ProfilePage.tsx";

export default function YourProfile() {
  const { session } = useSession();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Your Profile",
        }}
      />
      <ProfilePage profileId={session?.user.id} />
    </>
  );
}
