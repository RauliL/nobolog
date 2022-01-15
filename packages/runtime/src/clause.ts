import { Term } from "./term";
import { World } from "./world";

export type Clause = (args: Term[], world: World) => boolean;

export const createClauseMap = (): Map<string, Clause[]> => {
  const mapping = new Map<string, Clause[]>();

  mapping.set("false/0", [() => false]);
  mapping.set("true/0", [() => true]);

  mapping.set("isBoolean/1", [(args: Term[]) => args[0].type === "boolean"]);
  mapping.set("isList/1", [(args: Term[]) => args[0].type === "list"]);
  mapping.set("isNumber/1", [(args: Term[]) => args[0].type === "number"]);
  mapping.set("isString/1", [(args: Term[]) => args[0].type === "string"]);

  mapping.set("print/1", [
    (args: Term[]) => {
      console.log(args[0]);

      return true;
    },
  ]);

  return mapping;
};
