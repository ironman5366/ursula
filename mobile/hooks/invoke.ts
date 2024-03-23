import {
  InvocationParams,
  InvokeFn,
  LLMResponseStream,
} from "@ursula/shared-types/llm.ts";
import { supabase } from "../utils/supabase.ts";
import { SUPABASE_PROJECT_URL } from "../constants.ts";
import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source";

export async function* invoke(params: InvocationParams): LLMResponseStream {
  // This is a supabase function but because it uses SSE we'll invoke it on our own
  const functionUrl = `${SUPABASE_PROJECT_URL}/functions/v1/invoke-ai/`;
  const response = await fetchEventSource(functionUrl, {
    method: "POST",
    body: JSON.stringify(params),
    onmessage: (event) => {
      // @ts-ignore
      yield JSON.parse(event.data);
    },
    onclose: () => {},
  });

  console.log("Done");
  return;
}
