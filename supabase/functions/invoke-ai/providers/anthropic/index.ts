import LLM from "@ursula/shared-types/llm.ts";
import Anthropic from "npm:@anthropic-ai/sdk";
import { Tool } from "./types.ts";
import { jsonToXml } from "./utils.ts";
import {
  functionMessageToXml,
  FunctionStateMachine,
} from "./function_adapter.ts";

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

function generateSystemPrompt(
  systemMessage: string | undefined | null,
  functions?: LLM.Function[]
) {
  if (!functions) {
    return "";
  }

  const txt = functions
    .map((f) => jsonToXml(LLMFunctionToTool(f), "Tool"))
    .join("\n");

  const t = `
    ${systemMessage || ""}
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
          content: functionMessageToXml(message.function),
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

function tryMerge(
  messageOne: Anthropic.MessageParam,
  messageTwo: Anthropic.MessageParam
): Anthropic.MessageParam[] {
  if (messageOne.role === messageTwo.role) {
    return [
      {
        role: messageOne.role,
        content:
          (messageOne.content as string) + (messageTwo.content as string),
      },
    ];
  } else {
    return [messageOne, messageTwo];
  }
}

function mergeMessages(
  messages: Anthropic.MessageParam[]
): Anthropic.MessageParam[] {
  let newMessages: Anthropic.MessageParam[] = [];

  for (const message of messages) {
    if (newMessages.length === 0) {
      newMessages.push(message);
    } else {
      const lastMessage = newMessages[newMessages.length - 1];
      const maybeMerged = tryMerge(lastMessage, message);
      newMessages = newMessages.slice(0, -1).concat(maybeMerged);
    }
  }

  return newMessages;
}

export async function* invokeAnthropic({
  model,
  functions,
  messages,
  systemMessage,
  ...rest
}: LLM.InvocationParams): LLM.ResponseStream {
  console.log(JSON.stringify({ model, functions, messages, ...rest }, null, 2));
  const systemPrompt = generateSystemPrompt(systemMessage, functions);
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

  const mergedMessages = mergeMessages(transferredMessages);

  console.log(JSON.stringify(mergedMessages, null, 2));

  const stream = anthropic.messages.stream({
    model,
    max_tokens: 4096,
    messages: mergedMessages,
    system: systemPrompt,
  });

  // This will keep track of the output to tell if we're in a function
  const stateMachine = new FunctionStateMachine();
  for await (const messageStreamEvent of stream) {
    const typedEvent: Anthropic.MessageStreamEvent = messageStreamEvent;
    switch (typedEvent.type) {
      case "content_block_delta":
        for (const delta of stateMachine.emit(typedEvent.delta.text) || []) {
          yield delta;
        }
    }
  }

  console.log("Returning finished from anthropic");

  yield {
    role: "finished",
    reason: LLM.FinishReason.FINISHED,
  };

  return LLM.FinishReason.FINISHED;
}
