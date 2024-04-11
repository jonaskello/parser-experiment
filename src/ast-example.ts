import { parse } from "./parser";

// const ast = parse("size + (12 + 231) * -color + 5 - 1");
const ast = parse("size=1 & a=3");
console.dir(ast, { depth: null }); // log nested objects
