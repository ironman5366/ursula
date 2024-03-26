import { Send } from "@tamagui/lucide-icons";
import LLM from "@ursula/shared-types/llm.ts";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView } from "react-native";
import { Button, XStack, YStack } from "tamagui";
import { useInvoke } from "../../ai/invoke.ts";
import StyledInput from "../../components/atoms/StyledInput.tsx";
import ChatMessage, { AssistantMessage } from "./ChatMessage";
import Model = LLM.Model;

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, isInvoking, addMessage } = useInvoke({
    model: Model.ANTHROPIC_HAIKU,
  });

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled
      keyboardVerticalOffset={30}
    >
      <SafeAreaView>
        <YStack
          justifyContent="space-between"
          alignContent="space-between"
          height="100%"
          pb="$11"
          px="$3"
        >
          <YStack>
            {messages.map((message, i) => (
              <ChatMessage message={message} key={i} />
            ))}
          </YStack>
          <XStack gap="$2">
            <StyledInput
              value={input}
              onChangeText={(val) => setInput(val)}
              placeholder="What is dune about?"
              autoFocus={false}
            />
            <Button
              flex={1}
              flexGrow={2}
              disabled={isInvoking}
              onPress={() => {
                addMessage({ content: input, role: "user" });
              }}
              circular
              p="$1"
              backgroundColor="blue"
              icon={<Send size={20} color="white" />}
            ></Button>
          </XStack>
        </YStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
