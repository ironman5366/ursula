import {
  InvocationParams,
  LLMFunction,
  LLMResponseStream,
  LLMFinishReason,
  LLMRole,
} from "@ursula/shared-types/llm.ts";
import Anthropic from "npm:@anthropic-ai/sdk";
import { Tool } from "./types.ts";
import { jsonToXml } from "./utils.ts";

const anthropic = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
});

function LLMFunctionToTool(llmFunction: LLMFunction): Tool {
  return {
    tool_name: llmFunction.name,
    description: llmFunction.description,
    // @ts-ignore
    parameters: llmFunction.parameters,
  };
}

function generateSystemPrompt(functions?: LLMFunction[]) {
  if (!functions) {
    return "";
  }

  const txt = functions
    .map((f) => jsonToXml(LLMFunctionToTool(f), "Tool"))
    .join("\n");
  const t = `
    In this environment you have access to a set of tools you can use to answer the user's question.
    You may call them like this:
    <function_calls>
    <invoke>
    <tool_name>$TOOL_NAME</tool_name>
    <parameters>
    <$PARAMETER_NAME>$PARAMETER_VALUE</$PARAMETER_NAME>
    ...
    </parameters>
    </invoke>
    </function_calls>

    Here are the tools available:
    <tools>
      ${txt}
    </tools>
   `;
  return t;
}

// deno-lint-ignore require-yield
export async function* invokeAnthropic({
  model,
  functions,
}: InvocationParams): LLMResponseStream {
  const systemPrompt = generateSystemPrompt(functions);
  console.log("system prompt is ", systemPrompt);
  const stream = anthropic.messages.stream({
    model,
    max_tokens: 4096, //TODO: could be param
    messages: [
      {
        role: "user",
        content: "tell me about istanbul",
      },
    ],
  });

  for await (const messageStreamEvent of stream) {
    let typedEvent: Anthropic.MessageStreamEvent = messageStreamEvent;
    switch (typedEvent.type) {
      case "content_block_delta":
        yield {
          role: LLMRole.ASSISTANT,
          content: typedEvent.delta.text,
        };
    }
  }

  return LLMFinishReason.FINISHED;
}
