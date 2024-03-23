import React, { useCallback, useState } from "react";
import {
  LLMAssistantMessage,
  LLMMessage,
  LLMMessageDelta,
  Model,
} from "@ursula/shared-types/llm.ts";
import { SafeAreaView, TextInput } from "react-native";
import { Button, XStack, YStack } from "tamagui";
import ChatMessage, { AssistantMessage } from "./ChatMessage.tsx";
import { invoke, invokeWith } from "../../hooks/invoke.ts";

export default function ChatPage() {
  const [messages, setMessages] = useState<LLMMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currResponse, setCurrResponse] = useState<LLMAssistantMessage | null>(
    null
  );

  const invokeChat = async (chatMessages) => {
    console.log("invoking chat with ", messages);
    setIsGenerating(false);
    invokeWith({
      onMessage: (delta: LLMMessageDelta<LLMAssistantMessage>) => {
        console.log("got delta", delta);
        setCurrResponse((curr) => {
          if (curr == null) {
            return {
              role: "assistant",
              content: delta.content || "",
            };
          } else {
            return {
              role: "assistant",
              content: curr.content + delta.content,
            };
          }
        });
      },
      onFinish: (reason) => {
        setMessages((prev) => [...prev, currResponse as LLMAssistantMessage]);
        setIsGenerating(false);
      },
      model: Model.ANTHROPIC_HAIKU,
      messages: chatMessages,
    });
  };

  return (
    <SafeAreaView>
      <YStack>
        {messages.map((message, i) => (
          <ChatMessage message={message} key={i} />
        ))}
        {currResponse && (
          <AssistantMessage message={currResponse as LLMAssistantMessage} />
        )}
        <TextInput
          value={input}
          onChangeText={(val) => setInput(val)}
          placeholder={"Type here"}
        />
        <Button
          disabled={isGenerating}
          onPress={() => {
            const newMessages: LLMMessage[] = [
              ...messages,
              { content: input, role: "user" },
            ];
            setMessages(newMessages);
            setInput("");
            invokeChat(newMessages);
          }}
        >
          Send
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
