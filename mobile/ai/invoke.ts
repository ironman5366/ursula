import LLM from "@ursula/shared-types/llm.ts";
import { SUPABASE_ANON_KEY, SUPABASE_PROJECT_URL } from "../constants.ts";
import EventSource from "react-native-sse";

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
