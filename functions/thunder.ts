import { ThunderType } from "../types/thunder.type";

function thunder(args: ThunderType) {
  if (args.default === undefined) {
    throw Error("required `default` value for thunder!");
  } else if (args.key === undefined) {
    throw Error("required `key` value for thunder!");
  } else if (args.encrypt === undefined) {
    throw Error("required `encrypt` value for thunder!");
  } else if (args.key && typeof args.key !== "string") {
    throw Error("`key` is not string for thunder!");
  } else if (args.encrypt && typeof args.encrypt !== "boolean") {
    throw Error("`encrypt` is not boolean for thunder!");
  }
  return args;
}

export default thunder;
