import { parse } from "./parser";

const ast = parse("sin(2) + (12 + 231) * 3 + 5 - 1");
console.dir(ast, { depth: null }); // log nested objects
