import {
  InvocationParams,
  LLMFinishReason,
  LLMMessageDelta,
  LLMResponseStream,
} from "@ursula/shared-types/llm.ts";
import { SUPABASE_ANON_KEY, SUPABASE_PROJECT_URL } from "../constants.ts";
import EventSource from "react-native-sse";

export async function* invoke(params: InvocationParams): LLMResponseStream {
  const functionUrl = `${SUPABASE_PROJECT_URL}/functions/v1/invoke-ai/`;
  const eventSource = new EventSource(functionUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(params),
  });

  let messageQueue: LLMMessageDelta[] = [];
  let finishReason: LLMFinishReason | null = null;

  eventSource.addEventListener("error", (event) => {
    console.error(event);
    throw event;
  });

  eventSource.addEventListener("message", (message) => {
    messageQueue.push(JSON.parse(message.data));
  });

  eventSource.addEventListener("close", (event) => {
    // TODO: propagate this
    finishReason = LLMFinishReason.FINISHED;
  });

  while (true) {
    if (messageQueue.length > 0) {
      yield messageQueue.shift() as LLMMessageDelta;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    if (finishReason) {
      return finishReason;
    }
  }
}
