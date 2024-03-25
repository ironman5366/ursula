import LLM from "@ursula/shared-types/llm.ts";
import { parse } from "https://deno.land/x/xml/mod.ts";

type WatchingState = {
  type: "watching";
  matchingUpTo: number;
};

type InFunctionState = {
  type: "in-function";
  accumulated: string;
};

type InitialState = {
  type: "initial";
};

type State = WatchingState | InFunctionState | InitialState;

type ParsedInvokeFormat = {
  tool_name: string;
  parameters: { [key: string]: any };
};

function parseSingleFunctionCall(
  invocation: ParsedInvokeFormat
): LLM.FunctionCall {
  return {
    name: invocation.tool_name,
    arguments: invocation.parameters,
  };
}

/**
 * Takes a raw string like <function_calls>
 * <invoke>
 * <tool_name>function_name</tool_name>
 * <parameters>
 * <param1>value1</param1>
 * <param2>value2</param2>
 * </parameters>
 * </invoke>
 * </function_calls>
 *
 * and returns an object like {
 *     name: "function_name",
 *     arguments: {
 *        param1: "value1",
 *        param2: "value2"
 *     }
 * }
 */
function parseFunctionCallXml(rawFunctionCall: string): LLM.FunctionCall[] {
  console.log("parsing raw function call", rawFunctionCall);
  const data = parse(rawFunctionCall);
  console.log("parsed data", data);

  const functionCalls: {
    invoke: ParsedInvokeFormat[] | ParsedInvokeFormat;
  } = data.function_calls as any;

  if (Array.isArray(functionCalls.invoke)) {
    return functionCalls.invoke.map(parseSingleFunctionCall);
  }

  return [parseSingleFunctionCall(functionCalls.invoke)];
}

export class FunctionStateMachine {
  private startTok = "<function_calls>";
  private endTok = "</function_calls>";
  private state: State;

  constructor() {
    this.state = {
      type: "initial",
    };
  }

  emitWatching(delta: string): LLM.MessageDelta[] | null {
    for (let chIdx = 0; chIdx < delta.length; chIdx++) {
      const nextExpected = (this.state as WatchingState).matchingUpTo + 1;

      if (nextExpected == this.startTok.length) {
        this.state = {
          type: "in-function",
          accumulated: this.startTok,
        };
        // Add the rest of the delta, if any, to accumulated
        return this.emitInFunction(delta.substring(chIdx + 1));
      } else {
        if (this.startTok[nextExpected] === delta[chIdx]) {
          this.state = {
            type: "watching",
            matchingUpTo: nextExpected,
          };
        } else {
          this.state = {
            type: "initial",
          };
          // Emit the characters we've matched so far - we can throw them away
          const remaining = this.startTok.substring(0, nextExpected);
          if (remaining.length > 0) {
            return [
              {
                role: "assistant",
                content: remaining,
              },
            ];
          }
        }
      }
    }
    return null;
  }

  emitInitial(delta: string): LLM.MessageDelta[] | null {
    console.log("in emitInitial");
    for (let chIdx = 0; chIdx < delta.length; chIdx++) {
      const ch = delta[chIdx];
      if (ch === this.startTok[0]) {
        this.state = {
          type: "watching",
          matchingUpTo: 0,
        };
        return this.emitWatching(delta.substring(chIdx + 1));
      }
    }

    // We didn't match the start token, emit the characters we've seen
    if (delta.length > 0) {
      return [
        {
          role: "assistant",
          content: delta,
        },
      ];
    }
    return null;
  }

  emitInFunction(delta: string): LLM.MessageDelta[] | null {
    (this.state as InFunctionState).accumulated += delta;

    if ((this.state as InFunctionState).accumulated.includes(this.endTok)) {
      const endIdx =
        (this.state as InFunctionState).accumulated.indexOf(this.endTok) +
        this.endTok.length;
      const functionCallContent = (
        this.state as InFunctionState
      ).accumulated.substring(0, endIdx);

      const functionCalls = parseFunctionCallXml(functionCallContent);

      let deltas: LLM.MessageDelta[] = functionCalls.map((f) => ({
        role: "assistant",
        function: f,
      }));

      const rest = (this.state as InFunctionState).accumulated.substring(
        endIdx
      );

      this.state = { type: "initial" };
      const remainingDeltas = this.emit(rest);

      if (remainingDeltas) {
        deltas = [...deltas, ...remainingDeltas];
      }

      console.log("Returning finalized function deltas", deltas);
      return deltas;
    } else {
      return null;
    }
  }

  emit(delta: string): LLM.MessageDelta[] | null {
    switch (this.state.type) {
      case "initial":
        return this.emitInitial(delta);
      case "watching":
        return this.emitWatching(delta);
      case "in-function":
        return this.emitInFunction(delta);
    }
  }
}
