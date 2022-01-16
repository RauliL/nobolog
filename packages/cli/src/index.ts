import { NobologSyntaxError } from "@nobolog/lexer";
import { World, operations, NobologRuntimeError } from "@nobolog/runtime";
import fs from "fs";
import { stdin, stdout } from "process";
import readline from "readline";
import { parse } from "ts-command-line-args";
import { fetch } from "version";

type Arguments = {
  help?: boolean;
  import?: string[];
  src?: string;
};

const importFile = (path: string, world: World) => {
  let source: string;

  try {
    source = fs.readFileSync(path).toString("utf-8");
  } catch (e) {
    process.stderr.write(`${e}\n`);
    process.exit(1);
  }

  world.eval(source);
};

const runInteractive = (world: World) => {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
  });
  const prompt = () =>
    rl.question("> ", (line) => {
      if (/^\s*\.?(exit|quit)\s*$/i.test(line)) {
        process.exit(0);
      } else {
        try {
          const result = world.eval(line);

          if (result != null) {
            stdout.write(`${operations.toSource(result)}\n`);
          }
        } catch (e) {
          if (
            e instanceof NobologRuntimeError ||
            e instanceof NobologSyntaxError
          ) {
            process.stdout.write(`${e}\n`);
          } else {
            throw e;
          }
        }
      }
      prompt();
    });

  fetch((err, version) => {
    if (version) {
      process.stdout.write(`Welcome to Nobolog v${version}.\n`);
    }
    prompt();
  });
};

export const run = () => {
  const world = new World();
  const args = parse<Arguments>(
    {
      help: {
        alias: "h",
        description: "Print this usage guide",
        optional: true,
        type: Boolean,
      },
      import: {
        alias: "i",
        description: "Import file before running the script",
        multiple: true,
        optional: true,
        type: String,
      },
      src: {
        alias: "s",
        defaultOption: true,
        description: "Script to run",
        optional: true,
        type: String,
      },
    },
    { helpArg: "help" }
  );

  args.import?.forEach((path) => importFile(path, world));

  if (!args.src || args.src === "-") {
    runInteractive(world);
  } else {
    importFile(args.src, world);
  }
};
