import {
  InvocationParams,
  LLMFunction,
  LLMResponseStream,
} from "@ursula/shared-types/llm.ts";
import Anthropic from "npm:anthropic-ai/sdk@^0.19.0";
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

export async function invokeAnthropic({ model, functions }: InvocationParams) {
  const systemPrompt = generateSystemPrompt(functions);
  console.log("system prompt is ", systemPrompt);
  const stream = anthropic.messages.stream({
    model,
    max_tokens: 1024, //TODO: could be param
    messages: [
      {
        role: "system",
        content: generateSystemPrompt(functions),
      },
      {
        role: "user",
        content: "test",
      },
    ],
  });
  for await (const messageStreamEvent of stream) {
    console.log("message event", messageStreamEvent);
  }
}
