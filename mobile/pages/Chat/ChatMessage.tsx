import React, { useEffect, useState } from "react";
import LLM from "@ursula/shared-types/llm.ts";
import { Avatar, Text, XStack, YStack } from "tamagui";
import { useCurrentProfile } from "../../hooks/profile.ts";
import ProfileImage from "../../components/atoms/profile/ProfileImage.tsx";
import {
  FUNCTION_BINDINGS,
  FunctionBinding,
} from "../../ai/functions/bindings.ts";
import { ActivityIndicator } from "react-native";
import { StyledText } from "../../components/atoms/StyledText.tsx";

interface Props<M extends LLM.Message> {
  message: M;
}

function AssistantMessage({ message }: Props<LLM.AssistantMessage>) {
  if (!message.content.trim()) {
    return <></>;
  }
  return (
    <>
      <XStack
        my={2}
        alignItems="flex-start"
        mt="$2"
        justifyContent="flex-start"
        gap={4}
      >
        <Avatar backgroundColor="green" circular size={30}></Avatar>
        <YStack backgroundColor="gray" mr="$7" borderRadius="$3" p="$2">
          {message.content && (
            <Text lineBreakMode="tail" color="white">
              {message.content.trim()}
            </Text>
          )}
        </YStack>
      </XStack>
    </>
  );
}

// Fix overflow, text wrapping
function UserMessage({ message }: Props<LLM.UserMessage>) {
  const { data: profile } = useCurrentProfile();

  return (
    <XStack my={2} justifyContent="flex-end" gap={4} ml={"$9"}>
      <YStack backgroundColor="$claret" borderRadius="$3" p="$2">
        <Text color="white">{message.content}</Text>
      </YStack>
      <ProfileImage profile={profile} size={30} />
    </XStack>
  );
}

function BoundFunctionMessage<I, R>({
  message,
  binding,
}: Props<LLM.FunctionCallMessage> & {
  binding: FunctionBinding<I, R>;
}) {
  const [result, setResult] = useState<R>();

  useEffect(() => {
    binding
      .invoke(message.function.arguments)
      .then((result) => {
        setResult(result);
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }, []);

  if (result === undefined) {
    return <ActivityIndicator size={"small"} />;
  }

  return binding.render({
    input: message.function.arguments,
    result,
  });
}

function FunctionMessage({ message }: Props<LLM.FunctionCallMessage>) {
  const functionName = message.function.name;
  if (!(functionName in FUNCTION_BINDINGS)) {
    console.error(`Function ${functionName} not found`);
    return <Text>Error: function {functionName} not found</Text>;
  }

  const binding = FUNCTION_BINDINGS[functionName];

  return <BoundFunctionMessage message={message} binding={binding} />;
}

export default function ChatMessage({ message }: Props<LLM.Message>) {
  switch (message?.role) {
    case "assistant":
      if ("content" in message) {
        return <AssistantMessage message={message} />;
      } else {
        return <FunctionMessage message={message} />;
      }
    case "system":
      return <></>;
    case "user":
      return <UserMessage message={message} />;
  }
}
