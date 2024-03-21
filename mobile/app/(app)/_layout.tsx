import { useSession } from "../../contexts/SessionContext.ts";
import { Redirect, Stack } from "expo-router";
import React from "react";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";

export default function App() {
  const { session, loading } = useSession();

  if (loading && !(session && session.user)) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href={"/(onboard)/welcome"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen name="bookDetail/[id]" options={{ title: "Book" }} />
      <Stack.Screen name="review/[id]" options={{ title: "Review " }} />
      <Stack.Screen name="rank/[id]" options={{ title: "Review" }} />
      <Stack.Screen name="followers/[id]" options={{ title: "Followers" }} />
      <Stack.Screen name="following/[id]" options={{ title: "Following" }} />
      <Stack.Screen name="profile/[id]" options={{ title: "Profile" }} />
      <Stack.Screen name="profile/edit" options={{ title: "Edit" }} />
    </Stack>
  );
}
