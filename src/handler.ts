import colors from "ansi-colors";
import { readFile, writeFile } from "fs/promises";
import glob from "glob";
import { Project } from "ts-morph";
import { extractScriptFromVue } from "./lib/extractScriptFromVue";
import { generateProgressBar } from "./lib/progressBar";
import { getExportedObject } from "./lib/getNodes";
import { getPropertyNames } from "./lib/getPropertyNames";
import { getEvents } from "./lib/getEvents";

export const vueHandler = async ({
  targetPathPattern,
  position,
}: {
  targetPathPattern: string;
  position: number;
}): Promise<void> => {
  const filePaths = glob.sync(targetPathPattern, {
    ignore: "./**/node_modules/**/*",
  });

  // ファイル群からいろんな情報を含んだFileInfoオブジェクトを作成
  const allFiles = await Promise.all(
    filePaths.map(async (path) => {
      const fullText = await readFile(path, "utf8");
      const { script, isTs } = extractScriptFromVue(fullText);
      return {
        path,
        fullText,
        script,
        isTs,
      };
    })
  );

  // Start progress bar
  const progressBar = generateProgressBar(colors.green);
  progressBar.start(allFiles.length, 0);

  // VueファイルからTSファイルを作成する
  const project = new Project({
    useInMemoryFileSystem: true,
  });
  const targetFilesWithSourceFile = allFiles.map((file) => {
    const sourceFile = project.createSourceFile(`${file.path}.ts`, file.script);
    return {
      ...file,
      sourceFile,
    };
  });

  for await (const file of targetFilesWithSourceFile) {
    // scriptタグがないファイルはskip
    if (file.script === "") {
      progressBar.increment();
      continue;
    }

    // export していなかったskip
    const exportedObject = getExportedObject(file.sourceFile);
    if (!exportedObject) {
      progressBar.increment();
      continue;
    }

    // 既にemits optionがあったらskip
    const optionNames = getPropertyNames(file.sourceFile);
    if (optionNames.includes("emits")) {
      progressBar.increment();
      continue;
    }
    // emitがなければskip
    const emitEvents = getEvents(file);
    if (!Object.keys(emitEvents).length) {
      progressBar.increment();
      continue;
    }

    // 挿入する emits option objectの文字列
    // TODO: ts-morphで組み立てるようにする
    const emitsObjectText = Object.entries(emitEvents).reduce<string>(
      (accum, current, i) => {
        const name = current[0];
        const types = current[1].type;
        const hasPayload = current[1].hasPayload;

        const argument = !hasPayload
          ? ""
          : types.length
          ? `payload: ${types.join(" | ")}`
          : "payload";

        accum = `${accum} ${name}: (${argument}) => true, `;
        if (i === Object.keys(emitEvents).length - 1) {
          accum = `${accum}}`;
        }
        return accum;
      },
      "{"
    );

    // sourceFileにemits propertyを挿入する
    exportedObject.insertPropertyAssignment(position, {
      name: "emits",
      initializer: emitsObjectText,
    });
    const newText = file.fullText.replace(
      file.script,
      file.sourceFile.getFullText()
    );
    await writeFile(file.path, newText);

    progressBar.increment();
  }

  progressBar.stop();
};
