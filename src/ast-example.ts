import { parse } from "./parser";

const ast = parse("size + (12 + 231) * -color + 5 - 1");
console.dir(ast, { depth: null }); // log nested objects
