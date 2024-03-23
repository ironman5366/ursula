export type LLMFunction = {
  name: string;
  description: string;
  parameters: any;
};

export type LLMFunctionCall = {
  name: string;
};

export type LLMSystemMessage = {
  role: "system";
  content: string;
};

export type LLMUserMessage = {
  role: "user";
  content: string;
};

export type LLMAssistantMessage = {
  role: "assistant";
  content: string;
};

export type LLMAssistantFunctionCall = {
  role: "assistant";
  function: LLMFunctionCall;
};

export type LLMFunctionMessage = {
  role: "function";
  name: string;
  content: string | null;
};

export type LLMMessage =
  | LLMSystemMessage
  | LLMUserMessage
  | LLMAssistantMessage
  | LLMAssistantFunctionCall
  | LLMFunctionMessage;

export enum LLMFinishReason {
  FINISHED,
  MAX_LENGTH,
  FUNCTION_CALL,
  CONTENT_FILTER,
}

export type LLMMessageDelta<T extends LLMMessage = LLMMessage> = Partial<T>;

export enum Model {
  ANTHROPIC_HAIKU = "claude-3-haiku-20240307",
}

export type InvocationParams = {
  model: Model;
  messages: LLMMessage[];
  functions?: LLMFunction[];
  // Optionally force the model to call a specific function by giving the name of it
  force_function?: string;
};

export type LLMResponseStream = AsyncGenerator<
  LLMMessageDelta,
  LLMFinishReason
>;

export type InvokeFn = (params: InvocationParams) => LLMResponseStream;
