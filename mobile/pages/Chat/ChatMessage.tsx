import React from "react";
import {
  LLMAssistantMessage,
  LLMMessage,
  LLMUserMessage,
} from "@ursula/shared-types/llm.ts";
import { Text } from "tamagui";
import { StyledView } from "../../components/organisms/StyledView.tsx";

interface Props<M extends LLMMessage> {
  message: M;
}

export function AssistantMessage({ message }: Props<LLMAssistantMessage>) {
  return (
    <StyledView
      style={{
        backgroundColor: "lightBlue",
      }}
    >
      <Text>Assistant {message.content}</Text>
    </StyledView>
  );
}

export function UserMessage({ message }: Props<LLMUserMessage>) {
  return (
    <StyledView
      style={{
        backgroundColor: "yellow",
      }}
    >
      <Text>User {message.content}</Text>
    </StyledView>
  );
}

export default function ChatMessage({ message }: Props<LLMMessage>) {
  switch (message.role) {
    case "assistant":
      if ("content" in message) {
        return <AssistantMessage message={message} />;
      } else {
        return <Text>TODO: function call message</Text>;
      }
    case "system":
      return <Text>System {message.content}</Text>;
    case "user":
      return <Text>User {message.content}</Text>;
  }
}
