import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      initialRouteName="welcome"
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="follows"
        options={{
          headerShown: false,
          title: "Find People to Follow",
        }}
      />
      <Stack.Screen
        name="setup"
        options={{
          headerShown: false,
          title: "Setup your account",
        }}
      />
      <Stack.Screen
        name="finish"
        options={{
          headerShown: false,
          title: "Welcome",
        }}
      />
    </Stack>
  );
}
