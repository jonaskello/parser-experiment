import { AstNode, ComparisonOperationType, EqualsOperationType, IdentifierExpr, MulExpr, ValueExpr, UnaryExpr } from "./ast";
import { Token, TokenTypes, TokenizeState, getNextToken } from "./tokenizer";

type ParseState = { input: string; lookahead: Token | null; tokenizeState: TokenizeState };

export function parse(input: string): AstNode {
  const state: ParseState = { tokenizeState: { cursor: 0 }, input, lookahead: null };

  state.lookahead = getNextToken(input, state.tokenizeState);

  if (state.lookahead === null) {
    return { type: "EmptyExpr" };
  }

  return orExpr(state);
}

function orExpr(state: ParseState): AstNode {
  // OrExpr = AndExpr (_ "|" _ AndExpr)*
  let left = andExpr(state);
  while (state.lookahead !== null && state.lookahead.type === TokenTypes.OR) {
    eat(state.lookahead.type, state).value;
    left = { type: "OrExpr", left, right: andExpr(state) };
  }
  return left;
}

function andExpr(state: ParseState): AstNode {
  // AndExpr = Expr (_ "&" _ Expr)*
  let left = expr(state);
  while (state.lookahead !== null && state.lookahead.type === TokenTypes.AND) {
    eat(state.lookahead.type, state).value;
    left = { type: "AndExpr", left, right: expr(state) };
  }
  return left;
}

function expr(state: ParseState) {
  // Expr  = ("(" OrExpr ")")  /	ComparisonExpr
  if (state.lookahead?.type === TokenTypes.PARAN_LEFT) {
    eat(TokenTypes.PARAN_LEFT, state);
    const expression = orExpr(state);
    eat(TokenTypes.PARAN_RIGHT, state);
    return expression;
  }
  return comparisonExpr(state);
}

function comparisonExpr(state: ParseState): AstNode {
  // ComparisonExpr = AddExpr ( (_ (">=" / "<=" / ">" / "<") _ AddExpr) / (_ ("=" / "!=") _ ValueRangeExpr ("," ValueRangeExpr)*) )

  let left = addExpr(state);

  // ( (_ (">=" / "<=" / ">" / "<") _ AddExpr)
  const op = state.lookahead?.type;
  if (op === TokenTypes.GREATER_EQUALS || op === TokenTypes.LESS_EQUALS || op === TokenTypes.GREATER || op === TokenTypes.LESS) {
    eat(op, state).value;
    const operationType: ComparisonOperationType = op === ">=" ? "greaterOrEqual" : op === "<=" ? "lessOrEqual" : op === ">" ? "greater" : "less";
    left = { type: "ComparisonExpr", operationType, leftValue: left, rightValue: addExpr(state) };
    return left;
  }

  // (_ ("=" / "!=") _ ValueRangeExpr ("," ValueRangeExpr)*) )
  if (op === TokenTypes.EQUALS || op === TokenTypes.NOT_EQUALS) {
    eat(op, state).value;
    const valueRanges: Array<AstNode> = [];
    const vr = valueRangeExpr(state);
    valueRanges.push(vr);
    while (state.lookahead !== null && (state.lookahead.type as ",") === TokenTypes.COMMA) {
      eat(TokenTypes.COMMA, state).value;
      const vr = valueRangeExpr(state);
      valueRanges.push(vr);
    }
    const operationType: EqualsOperationType = op === "=" ? "equals" : "notEquals";
    return { type: "EqualsExpr", operationType, leftValue: left, rightValueRanges: valueRanges };
  }

  throw new Error("Unexpected");
}

function valueRangeExpr(state: ParseState): AstNode {
  // ValueRangeExpr = AddExpr (_ "~" _ AddExpr)?
  const left = addExpr(state);
  if (state.lookahead?.type === TokenTypes.TILDE) {
    eat(TokenTypes.TILDE, state);
    return { type: "ValueRangeExpr", min: left, max: addExpr(state) };
  }
  return left;
}

function addExpr(state: ParseState): AstNode {
  // AddExpr =	( (MultiplyExpr _ ("+" / "-") _ AddExpr) ) / MultiplyExpr
  let left = multiplyExpr(state);
  const op = state.lookahead?.type;
  if (op === TokenTypes.PLUS || op === TokenTypes.MINUS) {
    eat(op, state);
    const right = addExpr(state);
    return { type: "AddExpr", operationType: op === "+" ? "add" : "subtract", left, right };
  }
  return left;
}

function multiplyExpr(state: ParseState): UnaryExpr | MulExpr | IdentifierExpr | ValueExpr {
  // MultiplyExpr =	( (UnaryExpr _ ("*" / "/") _ MultiplyExpr)  ) / UnaryExpr
  let left = unaryExpr(state);
  const op = state.lookahead?.type;
  if (op === TokenTypes.STAR || op === TokenTypes.DIVIDE) {
    eat(op, state);
    const right = multiplyExpr(state);
    return { type: "MulExpr", operationType: op === "*" ? "multiply" : "divide", left, right };
  }
  return left;
}

function unaryExpr(state: ParseState): UnaryExpr | IdentifierExpr | ValueExpr {
  // UnaryExpr  = ( ("-" ValueExpr) ) / ValueExpr;
  if (state.lookahead?.type === TokenTypes.MINUS) {
    eat(TokenTypes.MINUS, state);
    return { type: "UnaryExpr", value: valueExpr(state) };
  }
  return valueExpr(state);
}

function valueExpr(state: ParseState): IdentifierExpr | ValueExpr {
  // ValueExpr  = "null" / ident (":" ident)? / propval
  if (state.lookahead?.type === TokenTypes.IDENTIFIER) {
    const token = eat(TokenTypes.IDENTIFIER, state);
    return { type: "IdentifierExpr", name: token.value, value: token.value };
  }

  const token = eat(TokenTypes.NUMBER, state);
  return { type: "ValueExpr", value: Number(token.value) };
}

function eat(tokenType: string, state: ParseState): Token {
  const token = state.lookahead;

  if (token == null) {
    throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`);
  }

  if (token.type !== tokenType) {
    throw new SyntaxError(`Unexpected token: "${token.value}", expected "${tokenType}"`);
  }

  state.lookahead = getNextToken(state.input, state.tokenizeState);

  return token;
}
