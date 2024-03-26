import { Send } from "@tamagui/lucide-icons";
import LLM from "@ursula/shared-types/llm.ts";
import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView } from "react-native";
import { Button, XStack, YStack } from "tamagui";
import { useInvoke } from "../../ai/invoke.ts";
import StyledInput from "../../components/atoms/StyledInput.tsx";
import ChatMessage from "./ChatMessage";
import Model = LLM.Model;
import ReviewWithBook from "../../types/ReviewWithBook.ts";
import { useReviews } from "../../hooks/reviews.ts";
import { useSession } from "../../contexts/SessionContext.ts";
import LoadingScreen from "../../components/atoms/LoadingScreen.tsx";
import { CHOOSE_BOOK_FUNCTION } from "../../ai/functions/chooseBook.ts";

export default function ChatPage() {
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
    model: Model.ANTHROPIC_HAIKU,
    systemMessage,
    functions: [CHOOSE_BOOK_FUNCTION],
  });

  useEffect(() => {
    console.log("messages are ", messages);
  }, [messages]);

  if (isLoading) {
    return <LoadingScreen />;
  }

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
              disabled={isInvoking}
              onPress={() => {
                addMessage({ content: input, role: "user" });
              }}
              circular
              p="$1"
              backgroundColor="blue"
              icon={<Send size={20} color="white" />}
            />
          </XStack>
        </YStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
