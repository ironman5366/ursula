// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import LLM from "@ursula/shared-types/llm.ts";
import "npm:@anthropic-ai/sdk@^0.19.0";
import { invokeAnthropic } from "./providers/anthropic/index.ts";

const MODEL_MAP: Record<LLM.Model, LLM.InvokeFn> = {
  [LLM.Model.ANTHROPIC_HAIKU]: invokeAnthropic,
  [LLM.Model.ANTHROPIC_SONNET]: invokeAnthropic,
};

Deno.serve(async (req) => {
  console.log("Request", req.url, req.headers.get("authorization"), req.body);
  const params: LLM.InvocationParams = await req.json();
  const invokationFn = MODEL_MAP[params.model];

  const body = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for await (const message of invokationFn(params)) {
        const data = `data: ${JSON.stringify(message)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }

      controller.close();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
});
