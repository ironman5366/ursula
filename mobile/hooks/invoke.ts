import {
  InvocationParams,
  LLMFinishReason,
  LLMMessageDelta,
  LLMResponseStream,
} from "@ursula/shared-types/llm.ts";
import { SUPABASE_PROJECT_URL } from "../constants.ts";
import { fetchEventSource } from "@microsoft/fetch-event-source";

async function queueDeltas(
  params: InvocationParams,
  queue: LLMMessageDelta[],
  close: (reason: LLMFinishReason) => void
) {
  const functionUrl = `${SUPABASE_PROJECT_URL}/functions/v1/invoke-ai/`;

  await fetchEventSource(functionUrl, {
    method: "POST",
    body: JSON.stringify(params),
    onmessage: (event) => {
      const delta = JSON.parse(event.data);
      queue.push(delta);
    },
    onclose: () => close(LLMFinishReason.FINISHED),
  });
}

export async function* invoke(params: InvocationParams): LLMResponseStream {
  // This is a supabase function but because it uses SSE we'll invoke it on our own

  let queue: LLMMessageDelta[] = [];
  let closeReason: LLMFinishReason | null = null;

  queueDeltas(params, queue, (reason) => (closeReason = reason));

  while (true) {
    if (closeReason) {
      return closeReason;
    }

    if (queue.length > 0) {
      const delta = queue.shift();
      yield delta;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
