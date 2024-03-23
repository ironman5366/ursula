
import {
  InvocationParams,
  LLMFunction,
  LLMResponseStream,
} from "@ursula/shared-types/llm";

import Anthropic from '@anthropic-ai/sdk';
import { Tool } from "./types";
import { jsonToXml } from "./utils";


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function LLMFunctionToTool(llmFunction: LLMFunction): Tool {
  return {
    tool_name: llmFunction.name,
    description: llmFunction.description,
    parameters: null //bad
}
}


function genereateSystemPrompt(functions: LLMFunction[]) { 
  const txt = functions.map(f=> jsonToXml(LLMFunctionToTool(f), "Tool")).join("\n")
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
   `
   return t
}




export function Invoke(param: InvocationParams){
  

  const response = anthropic.messages.stream({
    model: param.model,
    max_tokens: 1024, //TODO: could be param
    messages: [
      {
        role:"user",
        content: "test",
      }
    ]
  })
}