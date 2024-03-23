import React from "react";
import LLM from "@ursula/shared-types/llm.ts";
import { Text } from "tamagui";
import { StyledView } from "../../components/organisms/StyledView.tsx";

interface Props<M extends LLM.Message> {
  message: M;
}

export function AssistantMessage({ message }: Props<LLM.AssistantMessage>) {
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

export function UserMessage({ message }: Props<LLM.UserMessage>) {
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

export default function ChatMessage({ message }: Props<LLM.Message>) {
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
