import { SourceFile } from "ts-morph";
import { getExportedObject } from "./getNodes";

/**
 * sfcファイルからexportしているプロパティ名の配列を取得する
 */
export const getPropertyNames = (sourceFile: SourceFile) => {
  const exportedObject = getExportedObject(sourceFile);
  if (exportedObject === undefined) return [];

  return exportedObject
    .getProperties()
    .map((option) => option.getFirstChild()?.getText() ?? []);
};
