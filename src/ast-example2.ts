import { parse } from "./parser2";

const ast = parse("1 + 2 * 3 + 5 - 1");
console.dir(ast, { depth: null }); // log nested objects
