import { useSession } from "../../contexts/SessionContext.ts";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function App() {
  const { session } = useSession();
  if (!session) {
    return <Redirect href={"/(onboard)/welcome"} />;
  }

  return (
    <Stack
      screenOptions={{
        animationTypeForReplace: "pop",
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen name="bookDetail/[id]" options={{ title: "Book" }} />
      <Stack.Screen name="review/[id]" options={{ title: "Review " }} />
      <Stack.Screen name="rank/[id]" options={{ title: "Review" }} />
      <Stack.Screen name="followers/[id]" options={{ title: "Followers" }} />
      <Stack.Screen name="following/[id]" options={{ title: "Following" }} />
      <Stack.Screen name="profile/edit" options={{ title: "Edit" }} />
    </Stack>
  );
}
