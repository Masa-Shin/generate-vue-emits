import { parse } from "node-html-parser";

export const extractScriptFromVue = (
  source: string
): {
  script: string;
  isTs: boolean;
} => {
  const scriptTag = parse(source).querySelector("script");
  const script = scriptTag ? scriptTag.rawText : "";

  const isTs = scriptTag?.getAttribute("lang") === "ts";

  return {
    script,
    isTs,
  };
};
