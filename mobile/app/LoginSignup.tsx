import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { supabase } from "../utils/supabase";
import { TitleText } from "../components/atoms/TitleText";
import StyledButton from "../components/atoms/StyledButton";
import { StyledText } from "../components/atoms/StyledText";
import StyledInput from "../components/atoms/StyledInput";

export default function LoginSignup() {
  // Are we in login or signup mode?
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TitleText>Welcome to Ursula</TitleText>
      <StyledInput placeholder="Email" value={email} onChangeText={setEmail} />
      <StyledInput
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
