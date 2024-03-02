import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { supabase } from "../utils/supabase";
import { TitleText } from "../components/atoms/TitleText";
import StyledButton from "../components/organisms/StyledButton.tsx";
import { StyledText } from "../components/atoms/StyledText";
import { AuthError } from "@supabase/supabase-js";
import EmailInput from "../components/atoms/Emailnput";
import PasswordInput from "../components/atoms/PasswordInput";
import StyledInput from "../components/atoms/StyledInput.tsx";
import LoadingScreen from "../components/atoms/LoadingScreen.tsx";

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
    <View style={styles.container}>
      <View style={styles.form}>
        <TitleText>Welcome to Ursula</TitleText>
        <EmailInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <PasswordInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <StyledButton
          title={isLogin ? "Login" : "Sign Up"}
          onPress={signInWithEmail}
        />
        <StyledText>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </StyledText>
        <StyledButton
          title={isLogin ? "Sign Up" : "Login"}
          onPress={() => setIsLogin(!isLogin)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    flex: 0.5,
    justifyContent: "space-evenly",
  },
  input: {
    minWidth: "40%",
  },
});
