import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { supabase } from "../utils/supabase";

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

  return <View style={styles.container}>
    <TextInput placeholder={"Email"} />
    <Button title={"Signup"} />
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
