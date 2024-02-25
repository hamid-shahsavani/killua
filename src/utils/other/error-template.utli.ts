export function errorTemplate(params: { msg: string; key: string }): never {
  throw Error(`killua(${params.key})}): ${params.msg}`);
}
