import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";
import DismissKeyboardContainer from "../components/containers/DismissKeyboardContainer.tsx";
import { SessionProvider, useSession } from "../contexts/SessionContext.ts";
import LoginSignup from "../pages/LoginSignup.tsx";
import tamaguiConfig from "../tamagui.config.ts";
import { DARK_THEME, LIGHT_THEME } from "../theme.ts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const queryClient = new QueryClient();

function AuthenticatedStack() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="bookDetail/[id]" options={{ title: "Book" }} />
      <Stack.Screen name="review/[id]" options={{ title: "Review " }} />
      <Stack.Screen name="rank/[id]" options={{ title: "Review" }} />
      <Stack.Screen name="followers/[id]" options={{ title: "Followers" }} />
      <Stack.Screen name="following/[id]" options={{ title: "Following" }} />
    </Stack>
  );
}

function AuthRouter() {
  const { session } = useSession();

  if (session && session.user) {
    return <AuthenticatedStack />;
  } else {
    return <LoginSignup />;
  }
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <PostHogProvider
      apiKey="phc_4vhYsmmnKCTg1HT1HwcLHv2jAtsh9aIe3YmvRejScPN"
      options={{
        host: "https://app.posthog.com",
      }}
    >
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SessionProvider>
              <QueryClientProvider client={queryClient}>
                <ThemeProvider
                  value={colorScheme === "dark" ? DARK_THEME : LIGHT_THEME}
                >
                  <DismissKeyboardContainer>
                    <AuthRouter />
                  </DismissKeyboardContainer>
                </ThemeProvider>
              </QueryClientProvider>
            </SessionProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </TamaguiProvider>
    </PostHogProvider>
  );
}
