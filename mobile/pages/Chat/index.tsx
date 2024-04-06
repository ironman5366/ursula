import { Send } from "@tamagui/lucide-icons";
import LLM from "@ursula/shared-types/llm.ts";
import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Button, XStack, YStack } from "tamagui";
import { useInvoke } from "../../ai/invoke.ts";
import StyledInput from "../../components/atoms/StyledInput.tsx";
import ChatMessage from "./ChatMessage";
import { useReviews } from "../../hooks/reviews.ts";
import { useSession } from "../../contexts/SessionContext.ts";
import LoadingScreen from "../../components/atoms/loaders/LoadingScreen.tsx";
import { CHOOSE_BOOK_FUNCTION } from "../../ai/functions/chooseBook.tsx";

export default function ChatPage() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const { session } = useSession();
  const { data: reviews, isLoading } = useReviews(session.user.id);

  const systemMessage = useMemo(() => {
    let systemReviews = reviews || [];
    const initialPrompt =
      "You're a librarian, helping a user choose a book to read. Be concise and helpful. " +
      "Don't recommend any books they've already read, but use their list to understand their taste.";
    if (systemReviews.length === 0) {
      return initialPrompt;
    } else {
      const books = reviews.map(({ book, review }, i) => {
        return `#${i + 1}: ${book.title}\n`;
      });
      return `${initialPrompt}\nHere are some books they enjoy,
      in order of how much they enjoyed them\n:${books}`;
    }
  }, [reviews]);

  const { messages, isInvoking, addMessage } = useInvoke({
    model: LLM.Model.ANTHROPIC_SONNET,
    systemMessage,
    functions: [CHOOSE_BOOK_FUNCTION],
    messages: [
      {
        role: "assistant",
        content:
          "Hi! I'm Ursula, your AI librarian. I know about your reading tastes, so I can help you find a book you'll love. What are you in the mood for?",
      },
    ],
  });

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({
      animated: true,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToEnd();
    }, 500);
  }, [messages]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <YStack
        gap={"$2"}
        justifyContent={"space-between"}
        style={{
          flex: 0.85,
        }}
        mb={"$6"}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <YStack marginHorizontal="$3">
            <ScrollView>
              <YStack gap="$2">
                {messages.map((message, i) => (
                  <ChatMessage message={message} key={i} />
                ))}
              </YStack>
            </ScrollView>
          </YStack>
        </ScrollView>
        <XStack gap="$2" width={"100%"} px="$3">
          <StyledInput
            value={input}
            onChangeText={(val) => setInput(val)}
            placeholder="Ask me about anything book-related"
            autoFocus={false}
          />
          <Button
            flex={1}
            flexGrow={2}
            disabled={isInvoking}
            onPress={() => {
              addMessage({ content: input, role: "user" });
              setInput("");
              Keyboard.dismiss();
            }}
            circular
            p="$1"
            backgroundColor="$cambridgeBlue"
            icon={
              isInvoking ? (
                <ActivityIndicator size={"small"} />
              ) : (
                <Send size={20} color="white" />
              )
            }
          />
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}
