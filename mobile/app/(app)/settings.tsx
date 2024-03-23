import React, { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import StyledButton from "../../components/organisms/StyledButton.tsx";
import { useQueryClient } from "@tanstack/react-query";
import { TitleText } from "../../components/atoms/TitleText.tsx";
import { Stack } from "expo-router";
import useSignOut from "../../hooks/useSignOut.ts";
import { Button } from "tamagui";
import { invoke } from "../../ai/invoke.ts";
import LLM from "@ursula/shared-types/llm.ts";
import { CHOOSE_BOOK_FUNCTION } from "../../ai/functions/chooseBook.ts";

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
      <Button
        onPress={async () => {
          for await (const resp of invoke({
            model: LLM.Model.ANTHROPIC_HAIKU,
            messages: [{ role: "user", content: "Hello" }],
            functions: [CHOOSE_BOOK_FUNCTION],
          })) {
            console.log("invoke resp", resp);
          }
        }}
      >
        Try invoke
      </Button>
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
