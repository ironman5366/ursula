import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider, Theme } from "tamagui";
import DismissKeyboardContainer from "../components/containers/DismissKeyboardContainer.tsx";
import { SessionProvider } from "../contexts/SessionContext.ts";
import tamaguiConfig from "../tamagui.config.ts";
import { LIGHT_THEME } from "../theme.ts";
import { KeyboardProvider } from "../contexts/KeyboardContext.ts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
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

function RootLayoutNav() {
  return (
    <PostHogProvider
      apiKey="phc_4vhYsmmnKCTg1HT1HwcLHv2jAtsh9aIe3YmvRejScPN"
      options={{
        host: "https://app.posthog.com",
      }}
    >
      <TamaguiProvider config={tamaguiConfig} defaultTheme={"light"}>
        <Theme name={"light"}>
          <ThemeProvider
            // TODO: bring back dark mode when we have time to put into it
            value={DefaultTheme}
            //value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SessionProvider>
                <QueryClientProvider client={queryClient}>
                  <ThemeProvider value={LIGHT_THEME}>
                    <KeyboardProvider>
                      <DismissKeyboardContainer>
                        <Stack>
                          <Stack.Screen
                            name="(onboard)"
                            options={{ headerShown: false, title: "Welcome" }}
                          />
                          <Stack.Screen
                            name="(app)"
                            options={{
                              headerShown: false,
                              title: "Ursula",
                            }}
                          />
                        </Stack>
                      </DismissKeyboardContainer>
                    </KeyboardProvider>
                  </ThemeProvider>
                </QueryClientProvider>
              </SessionProvider>
            </GestureHandlerRootView>
          </ThemeProvider>
        </Theme>
      </TamaguiProvider>
    </PostHogProvider>
  );
}
