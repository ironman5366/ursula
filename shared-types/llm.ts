export enum LLMRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  FUNCTION = "function",
}

type LLMFunction = {
  name: string;
  description: string;
  parameters: object;
};

type FunctionCall = {
  name: string;
};

type LLMMessage =
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
      function: FunctionCall;
    }
  | {
      role: LLMRole.FUNCTION;
      name: string;
      content: string | null;
    };

type LLMMessageDelta = Partial<LLMMessage>;

export enum Model {
  ANTHROPIC_HAIKU,
}

interface InvocationParams {
  model: Model;
  messages: LLMMessage[];
  functions?: LLMFunction[];
  // Optionally force the model to call a specific function by giving the name of it
  force_function?: string;
}

export function invoke(params: InvocationParams): Generator<LLMMessageDelta> {
  // TODO
}
