import { useSession } from "../../contexts/SessionContext.ts";
import { Link, Redirect, Stack } from "expo-router";
import React from "react";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import { Pressable } from "react-native";
import { Settings2 } from "@tamagui/lucide-icons";
import { useThemeColor } from "../../theme.ts";

export default function App() {
  const { session, loading } = useSession();
  const primaryColor = useThemeColor("primary");

  if (loading && !(session && session.user)) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href={"/(onboard)/welcome"} />;
  }

  return (
    <Stack screenOptions={{}}>
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
      <Stack.Screen name="profile/edit" options={{ title: "Edit" }} />
    </Stack>
  );
}
