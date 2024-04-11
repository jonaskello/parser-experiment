import { parse } from "./parser";

// const ast = parse("size + (12 + 231) * -color + 5 - 1");
const ast = parse("size=1+2 & a=3 | foo=55");
console.dir(ast, { depth: null }); // log nested objects
