import LLM from "@ursula/shared-types/llm.ts";

type State =
  | {
      type: "watching";
      matchingUpTo: number;
    }
  | {
      type: "in-function";
      accumulated: string;
    }
  | {
      type: "initial";
    };

class FunctionStateMachine {
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
      const nextExpected =
        (this.state as Extract<State, { type: "watching" }>).matchingUpTo + 1;

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
          return null;
        } else {
          this.state = {
            type: "initial",
          };
          // Emit the characters we've matched so far - we can throw them away
          return [
            {
              role: "assistant",
              content: this.startTok.substring(0, nextExpected),
            },
          ];
        }
      }
    }
  }

  emitInitial(delta: string): LLM.MessageDelta[] | null {
    for (let chIdx = 0; chIdx < delta.length; chIdx++) {
      const ch = delta[chIdx];
      if (ch === this.startTok[0]) {
        this.state = {
          type: "watching",
          matchingUpTo: 0,
        };
      }
      return this.emitWatching(delta.substring(chIdx + 1));
    }

    // We didn't match the start token, emit the characters we've seen
    return [
      {
        role: "assistant",
        content: delta,
      },
    ];
  }

  emitInFunction(delta: string): LLM.MessageDelta[] | null {
    (this.state as Extract<State, { type: "in-function" }>).accumulated +=
      delta;
  }

  emit(delta: string): LLM.MessageDelta[] | null {
    switch (this.state.type) {
      case "initial":
        return this.emitInitial();
      case "watching":
        return this.emitWatching();
      case "in-function":
        return this.emitInFunction();
    }
  }

  finish() {}
}
