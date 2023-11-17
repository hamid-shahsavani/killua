export function errorTemplate(msg: string): never {
  throw Error(`killua: ${msg}`);
}
