import { getExport } from "./getNodes";
import { getPropertyNames } from "./getPropertyNames";

import { SourceFile, CallExpression, SyntaxKind, ts } from "ts-morph";

const VUE_API_TYPES = {
  OPTIONS_API: 0,
  COMPOSITION_API: 1,
  SCRIPT_SETUP: 2,
} as const;
type VueApiType = typeof VUE_API_TYPES[keyof typeof VUE_API_TYPES];
type CallExpressions = Array<CallExpression<ts.CallExpression>>;
type FileInfo = {
  sourceFile: SourceFile;
  path: string;
  fullText: string;
  script: string;
  isTs: boolean;
};

/**
 * sourceFileから関数呼び出し部分だけを抜き出す
 */
const getCallExpressions = (
  sourceFile: SourceFile
): CallExpressions | undefined => {
  return getExport(sourceFile)?.getDescendantsOfKind(SyntaxKind.CallExpression);
};

/**
 * Vue fileのAPI種別を取得する
 */
const getVueApiType = (file: FileInfo): VueApiType => {
  const propertyNames = getPropertyNames(file.sourceFile);
  // exportしているpropertyがないならば、
  if (!propertyNames.length) return VUE_API_TYPES.SCRIPT_SETUP;

  // setupのoptionがあればcomposition API
  const hasSetupOption = propertyNames.some((name) => name === "setup");
  if (hasSetupOption) return VUE_API_TYPES.COMPOSITION_API;

  return VUE_API_TYPES.OPTIONS_API;
};

/**
 * 全てのemitの呼び出しからイベント名を抽出する
 * @param sourceFile
 * @returns string[] - イベント名の配列
 */
export const getEvents = (
  file: FileInfo
): Record<
  string,
  {
    type: string[];
    hasPayload: boolean;
  }
> => {
  const callExpressions = getCallExpressions(file.sourceFile);
  if (!callExpressions) return {};

  const apiType = getVueApiType(file);

  // emitの呼び出しを抽出
  let emitList: CallExpressions;
  if (apiType === VUE_API_TYPES.COMPOSITION_API) {
    emitList = callExpressions.filter((call) =>
      call.getText().startsWith("emit(")
    );
  } else if (apiType === VUE_API_TYPES.OPTIONS_API) {
    emitList = callExpressions.filter((call) =>
      call.getText().startsWith("this.$emit(")
    );
  } else {
    emitList = [];
  }

  // emit 呼び出しからイベントを抽出
  return emitList.reduce<
    Record<
      string,
      {
        type: string[];
        hasPayload: boolean;
      }
    >
  >((accum, current) => {
    const argumentList = current.getArguments();
    const eventName = argumentList[0].getText().slice(1, -1);
    const payload = argumentList[1];
    const type = file.isTs
      ? payload?.getType().getText().replace(";", "")
      : undefined;

    if (!accum[eventName]) {
      accum[eventName] = {
        type: [],
        hasPayload: !!payload,
      };
    }

    if (type && payload && !accum[eventName].type.includes(type)) {
      accum[eventName].type.push(type);
    }
    return accum;
  }, {});
};
