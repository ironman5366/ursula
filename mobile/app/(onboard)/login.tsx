import { AuthError } from "@supabase/supabase-js";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView } from "react-native";
import { Button, YStack, Text, Input } from "tamagui";
import LoadingScreen from "../../components/atoms/LoadingScreen";
import DismissKeyboardContainer from "../../components/containers/DismissKeyboardContainer";
import { FloatingActionBar } from "../../components/containers/TabBar";
import { supabase } from "../../utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PasswordInput from "../../components/atoms/PasswordInput.tsx";
import EmailInput from "../../components/atoms/Emailnput.tsx";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO: turn this into a hook
  const persistsSuccessfullLogin = async (value) => {
    try {
      await AsyncStorage.setItem("loggedInBefore", value);
    } catch (e) {}
  };

  const loggedInBefore = async () => {
    try {
      const value = await AsyncStorage.getItem("loggedInBefore");
      if (value !== null) {
        return true;
      }
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const hasDoneThisBefore = await loggedInBefore();
      console.log("hasDoneThisBefore", hasDoneThisBefore);
      setIsLogin(hasDoneThisBefore);
    };
    checkLoginStatus();
  }, []);

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
      // use async storage to store that user has already logged in
      persistsSuccessfullLogin("true");
      router.replace("/(tabs)");
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
          <YStack alignItems="center" py="$8">
            <Text fontSize="$8" mb="$14">
              Ursula
            </Text>
            <YStack width="100%" px="$5" gap="$1" mb="$6">
              <Text fontSize={25}>Sign Up</Text>
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
            <Button mt="$7" unstyled onPress={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account" : "I have an account"}
            </Button>
          </YStack>
        </SafeAreaView>
        <FloatingActionBar>
          <Button
            width={300}
            unstyled
            alignSelf="center"
            height={50}
            px={10}
            onPress={signInWithEmail}
            fontWeight="bold"
            color="white"
            flexDirection="row"
            alignItems="center"
            alignContent="space-around"
            justifyContent="space-around"
          >
            {isLogin ? "Login" : "Sign Up"}
          </Button>
        </FloatingActionBar>
      </YStack>
    </DismissKeyboardContainer>
  );
}
