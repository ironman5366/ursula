import React from "react";
import LLM from "@ursula/shared-types/llm.ts";
import { Avatar, Text, XStack, YStack } from "tamagui";
import { StyledView } from "../../components/organisms/StyledView.tsx";
import { useCurrentProfile } from "../../hooks/profile.ts";
import ProfileImage from "../../components/atoms/ProfileImage.tsx";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props<M extends LLM.Message> {
  message: M;
}

// TOOD: clean this up
export function AssistantMessage({ message }: Props<LLM.AssistantMessage>) {
  return <RenderBotMessage message={message} />;
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
  switch (message?.role) {
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

export function RenderBotMessage({ message }: Props<LLM.AssistantMessage>) {

  return (
    <XStack my={2} justifyContent="flex-start" gap={4}>
      <Avatar backgroundColor='green' circular size={30}>
       
      </Avatar>
      <YStack backgroundColor="gray" mr="$7" mt="$2" borderRadius="$3" p="$2">
        <Text color="white">{message.content}</Text>
      </YStack>
    </XStack>
  );
}


// Fix overflow, text wrapping
export function RenderUserMessage({ message }: Props<LLM.UserMessage>) {
  const { data: profile } = useCurrentProfile();

  return (
    <XStack my={2} justifyContent="flex-end" gap={4}>
      <YStack backgroundColor="blue" borderRadius="$3" p="$2">
        <Text color="white">{message.content}</Text>
      </YStack>
      <ProfileImage profile={profile} size={30} />
    </XStack>
  );
}
