import { Send } from "@tamagui/lucide-icons";
import LLM from "@ursula/shared-types/llm.ts";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, KeyboardAvoidingViewComponent, SafeAreaView } from "react-native";
import { Button, XStack, YStack } from "tamagui";
import { invokeWith } from "../../ai/invoke.ts";
import StyledInput from "../../components/atoms/StyledInput.tsx";
import ChatMessage, { AssistantMessage } from "./ChatMessage";

export default function ChatPage() {
  const [messages, setMessages] = useState<LLM.Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currResponse, setCurrResponse] = useState<LLM.AssistantMessage | null>(
    null
  );

  const invokeChat = async (chatMessages) => {
    console.log("invoking chat with ", messages);
    setIsGenerating(false);
    invokeWith({
      onMessage: (delta: LLM.MessageDelta<LLM.AssistantMessage>) => {
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
        if (currResponse) {
          setMessages((prev) => [
            ...prev,
            currResponse as LLM.AssistantMessage,
          ]);
         
        }
         setCurrResponse((curr) => {
           setMessages((prev) => [...prev, curr]);
           setIsGenerating(false);
           return null;
         });
        setIsGenerating(false);
      },
      model: LLM.Model.ANTHROPIC_HAIKU,
      messages: chatMessages,
    });
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={30}>
      <SafeAreaView>
        <YStack
          justifyContent="space-between"
          alignContent="space-between"
          height="100%"
          pb="$11"
          px="$3"
        >
          {/* {messages.map((message, i) => (
          <ChatMessage message={message} key={i} />
        ))}
        {currResponse && (
          <AssistantMessage message={currResponse as LLMAssistantMessage} />
        )} */}
          <RenderMessages messages={messages} />
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
              disabled={isGenerating}
              onPress={() => {
                const newMessages: LLM.Message[] = [
                  ...messages,
                  { content: input, role: "user" },
                ];
                setMessages(newMessages);
                setInput("");
                invokeChat(newMessages);
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

export function RenderMessages({
  messages,
}: {
  messages: (LLM.AssistantMessage | LLM.Message)[];
}) {
  return (
    <YStack>
      {messages.map((message, i) => {
        // TODO: check why nulls are being passed
        if (message?.role === "assistant") {
          return (
            <AssistantMessage
              message={message as LLM.AssistantMessage}
              key={i}
            />
          );
        } else {
          return <ChatMessage message={message} key={i} />;
        }
      })}
    </YStack>
  );
}
