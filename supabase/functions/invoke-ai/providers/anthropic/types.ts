// <tool_description>
// <tool_name>get_weather</tool_name>
// <description>
// Retrieves the current weather for a specified location.
// Returns a dictionary with two fields:
// - temperature: float, the current temperature in Fahrenheit
// - conditions: string, a brief description of the current weather conditions
// Raises ValueError if the provided location cannot be found.
// </description>
// <parameters>
// <parameter>
// <name>location</name>
// <type>string</type>
// <description>The city and state, e.g. San Francisco, CA</description>
// </parameter>
// </parameters>
// </tool_description>

export interface Tool {
  tool_name: string;
  description: string;
  parameters: ToolParam[];
}

export interface ToolParam {
  name: string;
  type: string;
  description: string;
}

// <function_calls>
// <invoke>
// <tool_name>function_name</tool_name>
// <parameters>
// <param1>value1</param1>
// <param2>value2</param2>
// </parameters>
// </invoke>
// </function_calls>

export interface FunctionCalls {
  invoke: FunctionInvoke;
}

export interface FunctionInvoke {
  tool_name: string;
  parameters: ParameterResponse;
}

interface ParameterResponse {
  [key: string]: string;
}
