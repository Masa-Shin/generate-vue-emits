import { ObjectLiteralExpression, SourceFile, SyntaxKind } from "ts-morph";

/**
 * sourceFileからdefault export部分を抜き出す
 */
export const getExport = (sourceFile: SourceFile) => {
  try {
    return sourceFile
      .getDefaultExportSymbolOrThrow()
      .getValueDeclarationOrThrow();
  } catch {
    return undefined;
  }
};

/**
 * sourceFileからexportしているobjectを取得する
 */
export const getExportedObject = (
  sourceFile: SourceFile
): ObjectLiteralExpression | undefined => {
  try {
    return getExport(sourceFile)?.getFirstDescendantByKindOrThrow(
      SyntaxKind.ObjectLiteralExpression
    );
  } catch {
    return undefined;
  }
};
