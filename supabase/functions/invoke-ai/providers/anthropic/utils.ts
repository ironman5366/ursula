import { create } from "npm:xmlbuilder2@^3.1.1";

export function jsonToXml(jsonObj: any, rootName: string = "root"): string {
  const str = create().ele(rootName).ele(jsonObj).end({ prettyPrint: true });
  // Strip the <xml> tags from the beginning and end.
  // We shouldn't have to do this, but I can't get the headless flag to
  // play nice
  const afterFirst = str.split(">").splice(1).join(">");
  const remaining = afterFirst.split("<");
  return remaining.splice(0, remaining.length - 1).join("<");
}
