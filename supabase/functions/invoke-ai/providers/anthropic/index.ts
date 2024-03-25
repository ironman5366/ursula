import LLM from "@ursula/shared-types/llm.ts";
import Anthropic from "npm:@anthropic-ai/sdk";
import { Tool } from "./types.ts";
import { jsonToXml } from "./utils.ts";

const anthropic = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
});

function LLMFunctionToTool(llmFunction: LLM.Function): Tool {
  return {
    tool_name: llmFunction.name,
    description: llmFunction.description,
    parameters: llmFunction.parameters,
  };
}

function generateSystemPrompt(functions?: LLM.Function[]) {
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

function llmMessageToAnthropicMessage(
  message: LLM.Message
): Anthropic.MessageParam {
  switch (message.role) {
    case "user":
      return message;
    case "assistant":
      if ("content" in message) {
        return message;
      } else {
        // The assistant called a function in this message
        return {
          role: "assistant",
          content: `[called function ${message.function.name}]`,
        };
      }
    case "function":
      return {
        role: "user",
        content: message.content || "[function returned void response]",
      };
  }
  throw new Error(`Invalid message for anthropic: ${message}`);
}

export async function* invokeAnthropic({
  model,
  functions,
  messages,
  ...rest
}: LLM.InvocationParams): LLM.ResponseStream {
  console.log(JSON.stringify({ model, functions, messages, ...rest }, null, 2));
  const systemPrompt = generateSystemPrompt(functions);
  console.log("system prompt is ", systemPrompt);
  const transferredMessages = messages.map(llmMessageToAnthropicMessage);

  if (functions) {
    if (transferredMessages[0].role === "user") {
      transferredMessages[0].content =
        systemPrompt + "\n" + transferredMessages[0].content;
    } else {
      transferredMessages.unshift({
        role: "user",
        content: systemPrompt,
      });
    }
  }

  console.log(JSON.stringify(transferredMessages, null, 2));

  const stream = anthropic.messages.stream({
    model,
    max_tokens: 4096,
    messages: transferredMessages,
  });

  for await (const messageStreamEvent of stream) {
    const typedEvent: Anthropic.MessageStreamEvent = messageStreamEvent;
    switch (typedEvent.type) {
      case "content_block_delta":
        yield {
          role: "assistant",
          content: typedEvent.delta.text,
        };
    }
  }

  console.log("Returning finished from anthropic");
  yield {
    role: "finished",
    reason: LLM.FinishReason.FINISHED,
  };

  return LLM.FinishReason.FINISHED;
}
