import LLM from "@ursula/shared-types/llm.ts";
import { SUPABASE_ANON_KEY, SUPABASE_PROJECT_URL } from "../constants.ts";
import EventSource from "react-native-sse";
import { useState } from "react";
import Message = LLM.Message;

export async function* invoke(
  params: LLM.InvocationParams
): LLM.ResponseStream {
  const functionUrl = `${SUPABASE_PROJECT_URL}/functions/v1/invoke-ai/`;
  const eventSource = new EventSource(functionUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(params),
  });

  let messageQueue: LLM.MessageDelta[] = [];
  let finishReason: LLM.FinishReason | null = null;

  eventSource.addEventListener("error", (event) => {
    console.error(event);
    throw event;
  });

  eventSource.addEventListener("message", (message) => {
    messageQueue.push(JSON.parse(message.data));
  });

  eventSource.addEventListener("close", (event) => {
    console.log("got close event");
    // TODO: propagate this
    finishReason = LLM.FinishReason.FINISHED;
  });

  while (true) {
    if (messageQueue.length > 0) {
      const message = messageQueue.shift() as LLM.MessageDelta;
      if (message.role === "finished") {
        return message.reason;
      }
      yield message;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (finishReason) {
      console.log("Returning from invoke");
      return finishReason;
    }
  }

  console.log("Done from invoke");
}

interface InvokeWithParams extends LLM.InvocationParams {
  onMessage?: (message: LLM.MessageDelta) => void;
  onFinish?: (reason: LLM.FinishReason) => void;
  onFunctionCall?: (call: LLM.FunctionCall) => void;
}

export async function invokeWith({
  onMessage,
  onFinish,
  onFunctionCall,
  ...params
}: InvokeWithParams) {
  const stream = invoke(params);

  for await (const message of stream) {
    if ("function" in message) {
      onFunctionCall && onFunctionCall(message.function);
    }
    onMessage && onMessage(message);
  }

  console.log("Done from invokeWith");

  // TODO: handle finish reason
  onFinish && onFinish(LLM.FinishReason.FINISHED);
}

function tryMergeMessages(
  messageOne: LLM.Message,
  messageTwo: LLM.MessageDelta
): LLM.Message[] {
  if (messageOne.role === "user" && messageTwo.role === "user") {
    return [
      {
        role: "user",
        content: (messageOne.content || "") + (messageTwo.content || ""),
      },
    ];
  } else if (
    messageOne.role === "assistant" &&
    messageTwo.role === "assistant" &&
    "content" in messageOne &&
    "content" in messageTwo
  ) {
    return [
      {
        role: "assistant",
        content: (messageOne.content || "") + (messageTwo.content || ""),
      },
    ];
  } else {
    return [messageOne, messageTwo as LLM.Message];
  }
}

export function useInvoke(
  args: Omit<InvokeWithParams, "messages" | "onMessage">
) {
  const [messages, setMessages] = useState<LLM.Message[]>([]);
  const [isInvoking, setInvoking] = useState(false);

  const addMessage = (message: Message) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
    setInvoking(true);
    invokeWith({
      ...args,
      messages: newMessages,
      onMessage: (delta) => {
        setMessages((curr) => {
          if (curr.length == 0) {
            return [delta as LLM.Message];
          } else {
            const lastMessage = curr[curr.length - 1];
            const maybeMerged = tryMergeMessages(lastMessage, delta);
            return [...curr.slice(0, curr.length - 1), ...maybeMerged];
          }
        });
      },
      onFinish: () => setInvoking(false),
    });
  };

  return { messages, addMessage, isInvoking };
}
