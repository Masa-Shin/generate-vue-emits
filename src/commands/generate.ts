import type { Arguments, Argv } from "yargs";
import { vueHandler } from "../handler";

type Options = {
  targetPathPattern: string;
  position: number;
  isTyped: boolean;
};

export const command = "generate [targetPathPattern]";
export const desc = "Generate & insert `emit` prop to all Vue files";

export const builder = (yargs: Argv<Options>): Argv<Options> => {
  return yargs
    .positional("target-path-pattern", {
      type: "string",
      requiresArg: true,
      description:
        "Path to the target vue files. Can be set with glob pattern. eg: './**/*.vue'",
      default: "./**/*.vue",
    })
    .option("t", {
      alias: "isTyped",
      demandOption: false,
      default: false,
      describe:
        "Whether emit's values are typed function or null. default false.",
      type: "boolean",
    })
    .option("p", {
      alias: "position",
      demandOption: false,
      default: 2,
      describe: "position to insert emits property. 0 = first, 1 = second,...",
      type: "number",
    });
};

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { targetPathPattern, position, isTyped } = argv;

  await vueHandler({
    targetPathPattern,
    position,
    isTyped,
  });

  console.log("\nCompleted 🎉");
  process.exit(0);
};
