namespace LLM {
  export type Function = {
    name: string;
    description: string;
    parameters: any;
  };

  export type FunctionCall = {
    name: string;
    // This is an object with keys as parameter names and values as parameter values
    arguments: any;
  };

  export type SystemMessage = {
    role: "system";
    content: string;
  };

  export type UserMessage = {
    role: "user";
    content: string;
  };

  export type AssistantMessage = {
    role: "assistant";
    content: string;
  };

  export type FunctionCallMessage = {
    role: "assistant";
    function: FunctionCall;
  };

  export type FunctionMessage = {
    role: "function";
    name: string;
    content: string | null;
  };

  export type FinishedMessage = {
    role: "finished";
    reason: FinishReason;
  };

  export type Message =
    | SystemMessage
    | UserMessage
    | AssistantMessage
    | FunctionCallMessage
    | FunctionMessage
    | FinishedMessage;

  export enum FinishReason {
    FINISHED,
    MAX_LENGTH,
    FUNCTION_CALL,
    CONTENT_FILTER,
  }

  export type MessageDelta<T extends Message = Message> = Partial<T>;

  export enum Model {
    ANTHROPIC_HAIKU = "claude-3-haiku-20240307",
  }

  export type InvocationParams = {
    model: Model;
    systemMessage?: string;
    messages: Message[];
    functions?: Function[];
    // Optionally force the model to call a specific function by giving the name of it
    force_function?: string;
  };

  export type ResponseStream = AsyncGenerator<MessageDelta, FinishReason>;

  export type InvokeFn = (params: InvocationParams) => ResponseStream;
}

export default LLM;
