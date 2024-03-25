import { Send } from "@tamagui/lucide-icons";
import LLM from "@ursula/shared-types/llm.ts";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
  SafeAreaView,
} from "react-native";
import { Button, XStack, YStack } from "tamagui";
import { invokeWith } from "../../ai/invoke.ts";
import StyledInput from "../../components/atoms/StyledInput.tsx";
import ChatMessage, { AssistantMessage } from "./ChatMessage";
import { CHOOSE_BOOK_FUNCTION } from "../../ai/functions/chooseBook.ts";

export default function ChatPage() {
  const [messages, setMessages] = useState<LLM.Message[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currResponse, setCurrResponse] = useState<LLM.AssistantMessage | null>(
    null
  );

  const invokeChat = async (chatMessages) => {
    setIsGenerating(false);
    invokeWith({
      functions: [CHOOSE_BOOK_FUNCTION],
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
      onFunctionCall: (call) => {
        console.log("got call", call);
      },
      systemMessage:
        "You're chatting with a user to recommend books to them. For each recommendation, talk to the user about it," +
        "and use your choose_book function",
      model: LLM.Model.ANTHROPIC_HAIKU,
      messages: chatMessages,
    });
  };

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
            {currResponse && (
              <AssistantMessage
                message={currResponse as LLM.AssistantMessage}
              />
            )}
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
