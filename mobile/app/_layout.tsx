import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DARK_THEME, LIGHT_THEME } from "../theme.ts";
import { SessionProvider, useSession } from "../contexts/SessionContext.ts";
import LoginSignup from "../pages/LoginSignup.tsx";

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
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DARK_THEME : LIGHT_THEME}
        >
          <AuthRouter />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
