import { PropertyValue } from "./ast";
import { evaluateAst } from "./eval";
import { parse } from "./parser";
import { printAst } from "./print-ast";
import { TokenizeState, getNextToken } from "./tokenizer";

main();

function main() {
  const propertyFilter = "size=1+2 & a!=3,1 | foo>55 | foo=1~5,10";
  const propertyValues: Record<string, PropertyValue> = { size: { type: "integer", value: 12 } };
  // const input = "size=1~2";

  printAllTokens(propertyFilter);

  const ast = parse(propertyFilter);
  console.dir(ast, { depth: null }); // log nested objects

  // printAst(ast);
  const result = evaluateAst(ast, propertyValues, true);
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
