import { Parser } from "./parser";

const parser = new Parser();
const ast = parser.parse("1 + 2 * 3 + 5 - 1");
console.dir(ast, { depth: null }); // log nested objects
