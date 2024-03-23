import LLM from "@ursula/shared-types/llm.ts";
import { SafeAreaView, TextInput } from "react-native";
import { Button, YStack } from "tamagui";
import ChatMessage, { AssistantMessage } from "./ChatMessage.tsx";
import { invokeWith } from "../../ai/invoke.ts";
import { useState } from "react";

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
        setMessages((prev) => [...prev, currResponse as LLM.AssistantMessage]);
        setIsGenerating(false);
      },
      model: LLM.Model.ANTHROPIC_HAIKU,
      messages: chatMessages,
    });
  };

  return (
    <SafeAreaView>
      <YStack>
        {messages.map((message, i) => (
          <ChatMessage message={message} key={i} />
        ))}
        {currResponse && (
          <AssistantMessage message={currResponse as LLM.AssistantMessage} />
        )}
        <TextInput
          value={input}
          onChangeText={(val) => setInput(val)}
          placeholder={"Type here"}
        />
        <Button
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
        >
          Send
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
