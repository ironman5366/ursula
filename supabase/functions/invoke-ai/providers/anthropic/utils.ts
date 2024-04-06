import { create } from "npm:xmlbuilder2@^3.1.1";

export function jsonToXml(jsonObj: any, rootName: string = "root"): string {
  return create().ele(rootName).ele(jsonObj).end({ prettyPrint: true });
}
