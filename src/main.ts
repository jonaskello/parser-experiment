import { evalAst } from "./eval-ast";
import { parse } from "./parser";
import { printAst } from "./print-ast";
import { TokenizeState, getNextToken } from "./tokenizer";

main();

function main() {
  const input = "size=1+2 & a!=3,1 | foo>55";
  // const input = "size=1,2";

  printAllTokens(input);

  const ast = parse(input);
  console.dir(ast, { depth: null }); // log nested objects

  printAst(ast);

  const result = evalAst(ast);
  console.log("result", result);
}

function printAllTokens(input: string) {
  const state: TokenizeState = { cursor: 0 };
  let t;
  while (true) {
    t = getNextToken(input, state);
    if (t === null) {
      break;
    }
    console.log("t", t);
  }
}
