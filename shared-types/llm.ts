export enum LLMRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  FUNCTION = "function",
}

export type LLMFunction = {
  name: string;
  description: string;
  parameters: object;
};

export type LLMFunctionCall = {
  name: string;
};

export type LLMMessage =
  | {
      role: LLMRole.SYSTEM;
      content: string;
    }
  | {
      role: LLMRole.USER;
      content: string;
    }
  | {
      role: LLMRole.ASSISTANT;
      content: string;
    }
  | {
      role: LLMRole.ASSISTANT;
      function: LLMFunctionCall;
    }
  | {
      role: LLMRole.FUNCTION;
      name: string;
      content: string | null;
    };

export type LLMMessageDelta = Partial<LLMMessage>;

export enum Model {
  ANTHROPIC_HAIKU,
}

export interface InvocationParams {
  model: Model;
  messages: LLMMessage[];
  functions?: LLMFunction[];
  // Optionally force the model to call a specific function by giving the name of it
  force_function?: string;
}
