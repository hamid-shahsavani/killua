export default function errorTemplate(msg: string): never {
  throw Error(`killua: ${msg}`);
}
