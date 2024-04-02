import { AuthError } from "@supabase/supabase-js";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView } from "react-native";
import { Button, YStack, Text } from "tamagui";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import DismissKeyboardContainer from "../../components/containers/DismissKeyboardContainer";
import { supabase } from "../../utils/supabase";
import PasswordInput from "../../components/atoms/inputs/PasswordInput.tsx";
import EmailInput from "../../components/atoms/inputs/Emailnput.tsx";
import FloatingActionBar from "../../components/organisms/FloatingActionBar";
import FloatingButton from "../../components/organisms/FloatingActionBar/FloatingButton.tsx";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(false);
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

    if (error) {
      Alert.alert(error.message);
    } else {
      if (isLogin) {
        router.replace("/(app)/(tabs)");
      } else {
        router.replace("/(onboard)/setup");
      }
    }
    setLoading(false);
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <DismissKeyboardContainer>
      <YStack fullscreen display="flex">
        <SafeAreaView>
          <YStack alignItems="center" py="$6">
            <Text fontSize="$8" mb="$14">
              Ursula
            </Text>
            <YStack width="100%" px="$5" gap="$1" mb="$6">
              <Text fontSize={25}>{isLogin ? "Login" : "Sign Up"}</Text>
            </YStack>
            <YStack width="100%" px="$5" gap="$3">
              <EmailInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <PasswordInput
                placeholder="Pick a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </YStack>
            <Button mt="$3" unstyled onPress={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account" : "I have an account"}
            </Button>
          </YStack>
        </SafeAreaView>
        <FloatingActionBar>
          <FloatingButton onPress={signInWithEmail}>
            {isLogin ? "Login" : "Sign Up"}
          </FloatingButton>
        </FloatingActionBar>
      </YStack>
    </DismissKeyboardContainer>
  );
}
