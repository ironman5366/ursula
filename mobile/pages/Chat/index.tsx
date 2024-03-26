import { Send } from "@tamagui/lucide-icons";
import LLM from "@ursula/shared-types/llm.ts";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
  SafeAreaView,
} from "react-native";
import { Button, ScrollView, XStack, YStack } from "tamagui";
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
    <KeyboardAvoidingView
      behavior="height"
      enabled
      style={{ flex: 1 }}
      keyboardVerticalOffset={30}
    >
      <ScrollView 
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          paddingBottom: "$20",

          marginHorizontal: "$3",
        }}
        style={{}}
      >
        <YStack>
          <RenderMessages messages={messages} />
          {currResponse && (
            <AssistantMessage message={currResponse as LLM.AssistantMessage} />
          )}
        </YStack>
      </ScrollView>
      <XStack
        gap="$2"
        position="absolute"
        bottom={0}
        mb="$14"
        width={"100%"}
        px="$3"
      >
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
