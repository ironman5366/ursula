export type LLMFunction = {
  name: string;
  description: string;
  parameters: any;
};

export type LLMFunctionCall = {
  name: string;
};

export type LLMMessage =
  | {
      role: "system";
      content: string;
    }
  | {
      role: "user";
      content: string;
    }
  | {
      role: "assistant";
      content: string;
    }
  | {
      role: "assistant";
      function: LLMFunctionCall;
    }
  | {
      role: "function";
      name: string;
      content: string | null;
    };

export enum LLMFinishReason {
  FINISHED,
  MAX_LENGTH,
  FUNCTION_CALL,
  CONTENT_FILTER,
}

export type LLMMessageDelta = Partial<LLMMessage>;

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
