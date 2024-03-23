import {
  LLMAssistantMessage,
  LLMMessage,
  LLMMessageDelta,
  Model,
} from "@ursula/shared-types/llm.ts";
import React, { useEffect, useState } from "react";
import LLM from "@ursula/shared-types/llm.ts";
import { SafeAreaView, TextInput } from "react-native";
import { Button, YStack } from "tamagui";
import { invokeWith } from "../../hooks/invoke.ts";
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
        console.log("finished", reason);
        setMessages((prev) => [...prev, currResponse as LLMAssistantMessage]);
        setIsGenerating(false);
        setCurrResponse((curr) => {
          setMessages((prev) => [...prev, curr]);
          setIsGenerating(false);
          return null;
        });
      },
      model: LLM.Model.ANTHROPIC_HAIKU,
      messages: chatMessages,
    });
  };

  useEffect(() => {
    console.log(messages)
  },  [messages])

  return (
    <SafeAreaView>
      <YStack>
        {/* {messages.map((message, i) => (
          <ChatMessage message={message} key={i} />
        ))}
        {currResponse && (
          <AssistantMessage message={currResponse as LLMAssistantMessage} />
        )} */}
        <RenderMessages messages={messages} />
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


export function RenderMessages({ messages }: { messages: (LLMAssistantMessage | LLMMessage)[] }) {
  return (
    <YStack>
      {messages.map((message, i) =>  {
        if (message.role === "assistant") {
          return <AssistantMessage message={message as LLMAssistantMessage} key={i} />;
        } else {
          return <ChatMessage message={message} key={i} />;
        }
      })}
    </YStack>
  );
}