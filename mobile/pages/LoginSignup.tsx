import { AuthError } from "@supabase/supabase-js";
import { MoveRight } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet } from "react-native";
import { Button, Text, YStack } from "tamagui";
import LoadingScreen from "../components/atoms/LoadingScreen.tsx";
import DismissKeyboardContainer from "../components/containers/DismissKeyboardContainer.tsx";
import { FloatingActionBar } from "../components/containers/TabBar.tsx";
import { supabase } from "../utils/supabase";

export default function LoginSignup() {
  // Are we in login or signup mode?
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);

    let error: AuthError;
    if (isLogin) {
      const res = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      error = res.error;
    } else {
      const res = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      error = res.error;
    }

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <DismissKeyboardContainer>
      <YStack fullscreen display="flex">
        <SafeAreaView>
          <YStack alignItems="center" py="$8">
            <Text fontSize="$8">Ursula</Text>
            <Text
              fontFamily="$body"
              mt="$18"
              px="$2"
              textAlign="center"
              fontSize="$11"
            >
              Maybe some cool tagline three lines
            </Text>
          </YStack>
        </SafeAreaView>
        <FloatingActionBar>
          <Button
            flexDirection="row"
            fullscreen
            px="$5"
            alignItems="center"
            justifyContent="space-between"
            unstyled
            color="white"
            fontWeight="600"
            iconAfter={<MoveRight />}
          >
            Get started
          </Button>
        </FloatingActionBar>
      </YStack>
    </DismissKeyboardContainer>
  );
}
