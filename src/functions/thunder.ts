import { ThunderType } from "../types/thunder.type";

function thunder(args: ThunderType) {
  if (args.default === undefined) {
    throw new Error("required `default` value for thunder!");
  }
  if (args.key === undefined) {
    throw new Error("required `key` value for thunder!");
  }
  if (args.encrypt === undefined) {
    throw new Error("required `encrypt` value for thunder!");
  }
  if (args.expire === undefined) {
    throw new Error("required `expire` value for thunder!");
  }
  if (args.expire !== null && typeof args.expire !== "number") {
    throw new Error("`expire` is not a number or null for thunder!");
  }
  if (typeof args.key !== "string") {
    throw new Error("`key` is not a string for thunder!");
  }
  if (args.key.length === 0) {
    throw new Error("`key` is an empty string for thunder!");
  }
  if (args.key.startsWith("thunder")) {
    throw new Error("`key` can not start with `thunder` for thunder!");
  }
  if (typeof args.encrypt !== "boolean") {
    throw new Error("`encrypt` is not a boolean for thunder!");
  }
  if (
    args.actions !== undefined &&
    (Object.keys(args.actions).some((key) => typeof key !== "string") ||
      Object.keys(args.actions).some(
        (key) => typeof args.actions![key] !== "function"
      ))
  ) {
    throw new Error(
      "`actions` is not an object with string keys and function values for thunder!"
    );
  }
  return args;
}

export default thunder;