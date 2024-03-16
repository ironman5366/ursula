import React, { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { StyledView } from "../components/organisms/StyledView.tsx";
import { supabase } from "../utils/supabase.ts";
import StyledButton from "../components/organisms/StyledButton.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { TitleText } from "../components/atoms/TitleText.tsx";
import { useCurrentProfile } from "../hooks/profile.ts";
import { Stack } from "expo-router";

function DebugPanel() {
  const queryClient = useQueryClient();
  const [dumpedCache, setDumpedCache] = useState("");

  return (
    <>
      <TitleText>Debug Utils</TitleText>
      <StyledButton
        title={"Clear Query Cache"}
        onPress={async () => {
          await queryClient.invalidateQueries();
          Alert.alert("Cache cleared");
        }}
      />
      <StyledButton
        title={"Dump Profile Cache"}
        onPress={() => {
          const profileCache = queryClient.getQueriesData(["PROFILE"]);
          console.log(profileCache);
          setDumpedCache(JSON.stringify(profileCache, null, 2));
        }}
      />
      {dumpedCache && <Text>{dumpedCache}</Text>}
    </>
  );
}

export default function Settings() {
  const { data: profile } = useCurrentProfile();

  return (
    <StyledView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Settings",
        }}
      />
      <StyledButton
        title={"Sign Out"}
        onPress={() => {
          console.log("Signing out...");
          supabase.auth.signOut();
        }}
      />
      {process.env.NODE_ENV !== "production" && <DebugPanel />}
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "space-evenly",
  },
});