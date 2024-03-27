import { Send } from "@tamagui/lucide-icons";
import LLM from "@ursula/shared-types/llm.ts";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { Button, XStack, YStack } from "tamagui";
import { useInvoke } from "../../ai/invoke.ts";
import StyledInput from "../../components/atoms/StyledInput.tsx";
import ChatMessage from "./ChatMessage";
import { useReviews } from "../../hooks/reviews.ts";
import { useSession } from "../../contexts/SessionContext.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import { CHOOSE_BOOK_FUNCTION } from "../../ai/functions/chooseBook.tsx";

export default function ChatPage() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const { session } = useSession();
  const { data: reviews, isLoading } = useReviews(session.user.id);

  const systemMessage = useMemo(() => {
    let systemReviews = reviews || [];
    const initialPrompt =
      "You're a librarian, helping a user choose a book to read.";

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
    model: LLM.Model.ANTHROPIC_HAIKU,
    systemMessage,
    functions: [CHOOSE_BOOK_FUNCTION],
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
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
      >
        <YStack paddingBottom="$20" marginHorizontal="$3">
          <ScrollView>
            <YStack>
              {messages.map((message, i) => (
                <ChatMessage message={message} key={i} />
              ))}
            </YStack>
          </ScrollView>
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
          }}
          circular
          p="$1"
          backgroundColor="blue"
          icon={<Send size={20} color="white" />}
        />
      </XStack>
    </KeyboardAvoidingView>
  );
}
