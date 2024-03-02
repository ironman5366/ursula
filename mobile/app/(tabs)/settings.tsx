import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text } from "react-native";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import { supabase } from "../../utils/supabase.ts";
import StyledButton from "../../components/organisms/StyledButton.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { TitleText } from "../../components/atoms/TitleText.tsx";

function DebugPanel() {
  const queryClient = useQueryClient();
  const [dumpedCache, setDumpedCache] = useState("");

  return (
    <>
      <TitleText>Debug Utils</TitleText>
      <StyledButton>
        <Button
          title={"Clear Query Cache"}
          onPress={async () => {
            await queryClient.invalidateQueries();
            Alert.alert("Cache cleared");
          }}
        />
      </StyledButton>
      <StyledButton
        title={"Dump Cache"}
        onPress={() => {
          setDumpedCache(JSON.stringify(queryClient.getQueryCache(), null, 2));
        }}
      />
      {dumpedCache && <Text>{dumpedCache}</Text>}
    </>
  );
}

export default function Settings() {
  return (
    <StyledView style={styles.container}>
      <Button
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
  },
});
