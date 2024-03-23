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
    // TODO: propagate this
    finishReason = LLM.FinishReason.FINISHED;
  });

  while (true) {
    if (messageQueue.length > 0) {
      yield messageQueue.shift() as LLM.MessageDelta;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (finishReason) {
      return finishReason;
    }
  }
}

interface InvokeWithParams extends LLM.InvocationParams {
  onMessage?: (message: LLM.MessageDelta) => void;
  onFinish?: (reason: LLM.FinishReason) => void;
  // TODO: add on function call here when we're ready
}

export async function invokeWith({
  onMessage,
  onFinish,
  ...params
}: InvokeWithParams) {
  const stream = invoke(params);

  for await (const message of stream) {
    onMessage && onMessage(message);
  }

  // TODO: handle finish reason
  onFinish && onFinish(LLM.FinishReason.FINISHED);
}
