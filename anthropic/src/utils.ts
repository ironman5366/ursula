import { create } from "xmlbuilder2";
import { FunctionCalls } from "./types";


export function jsonToXml(jsonObj: any, rootName: string = 'root'): string {
    const xml = create({ version: '1.0' })
        .ele(rootName)
        .ele(jsonObj)
        .end({ prettyPrint: true });

    return xml;
}

// export function genFunctionXml(tool_name: string, parameters:  Parameter | Parameter[]) {
//   const functionCalls: FunctionCalls = {
//     invoke: {
//       tool_name,
//       parameters: parameters,
//     },
//   };
  
//   return jsonToXml(functionCalls, 'function_calls');
// }