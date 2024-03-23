// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import {
  InvocationParams,
  Model,
  InvokeFn,
  LLMRole,
  LLMMessageDelta,
  LLMFinishReason,
  LLMResponseStream,
} from "@ursula/shared-types/llm.ts";

console.log("Hello from Functions!");

async function* haikuStub(): LLMResponseStream {
  yield {
    role: LLMRole.ASSISTANT,
    content: "",
  };

  yield {
    role: LLMRole.ASSISTANT,
    content: "He",
  };

  yield {
    role: LLMRole.ASSISTANT,
    content: "llo",
  };

  yield {
    role: LLMRole.ASSISTANT,
    content: "!",
  };

  yield {
    role: LLMRole.SYSTEM,
    content: " World",
  };

  return LLMFinishReason.FINISHED;
}

const MODEL_MAP: Record<Model, InvokeFn> = {
  [Model.ANTHROPIC_HAIKU]: haikuStub,
};

Deno.serve(async (req) => {
  const params: InvocationParams = await req.json();
  const invokationFn = MODEL_MAP[params.model];

  const body = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      let count = 0;

      const timer = setInterval(() => {
        const data = `data: ${JSON.stringify({ count })}\n\n`;
        controller.enqueue(encoder.encode(data));
        count++;

        if (count > 10) {
          clearInterval(timer);
          controller.close();
        }
      }, 1000);
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

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/invoke-ai' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
