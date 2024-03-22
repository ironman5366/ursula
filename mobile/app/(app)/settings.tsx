import React, { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import { supabase } from "../../utils/supabase.ts";
import StyledButton from "../../components/organisms/StyledButton.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { TitleText } from "../../components/atoms/TitleText.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import { Stack, router } from "expo-router";
import useSignOut from "../../hooks/useSignOut.ts";
import { Link } from "@react-navigation/native";

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
      <Link to={"/(onboard)/follows"}>
        <Text>Try the follow page</Text>
      </Link>
    </>
  );
}

export default function Settings() {
  const signOut = useSignOut();

  return (
    <StyledView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Settings",
        }}
      />
      <StyledButton
        title={"Sign Out"}
        onPress={async () => {
          await signOut();
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
