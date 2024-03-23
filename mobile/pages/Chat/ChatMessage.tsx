import React from "react";
import LLM from "@ursula/shared-types/llm.ts";
import { Text } from "tamagui";
import { Text, XStack, YStack } from "tamagui";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import ProfileImage from "../../components/atoms/ProfileImage.tsx";

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
      return <RenderUserMessage message={message} />;
  }
}

export function RenderUserMessage({ message }: Props<LLMUserMessage>) {
  const { data: profile } = useCurrentProfile();

  return (
    <XStack my={2} justifyContent="flex-end" gap={4}>
      <YStack backgroundColor="blue" borderRadius="$3" p="$2">
        <Text color="white">User {message.content}</Text>
      </YStack>
      <ProfileImage profile={profile} size={30} />
    </XStack>
  );
}
