import { AstNode, BinaryExpression, ComparisionOperator, Identifier, MathOperator, Numeric, UnaryExpression } from "./ast";
import { Token, TokenTypes, TokenizeState, getNextToken } from "./tokenizer";

type ParseState = { input: string; lookahead: Token | null; tokenizeState: TokenizeState };

export function parse(input: string): AstNode {
  const state: ParseState = { tokenizeState: { cursor: 0 }, input, lookahead: null };

  state.lookahead = getNextToken(input, state.tokenizeState);

  return orExpr(state);
}

function orExpr(state: ParseState): AstNode {
  // OrExpr = AndExpr (_ "|" _ i:AndExpr)*
  let left = andExpr(state);
  while (state.lookahead !== null && state.lookahead.type === TokenTypes.OR) {
    const operator = eat(state.lookahead.type, state).value as MathOperator | ComparisionOperator;
    left = { type: "BinaryExpression", operator, left, right: andExpr(state) };
  }
  return left;
}

function andExpr(state: ParseState): AstNode {
  // AndExpr = Expr (_ "&" _ Expr)*
  let left = expr(state);
  while (state.lookahead !== null && state.lookahead.type === TokenTypes.AND) {
    const operator = eat(state.lookahead.type, state).value as MathOperator | ComparisionOperator;
    left = { type: "BinaryExpression", operator, left, right: expr(state) };
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
  if (
    state.lookahead?.type === TokenTypes.GREATER_EQUALS ||
    state.lookahead?.type === TokenTypes.LESS_EQUALS ||
    state.lookahead?.type === TokenTypes.GREATER ||
    state.lookahead?.type === TokenTypes.LESS
  ) {
    const operator = eat(state.lookahead.type, state).value as ComparisionOperator;
    left = { type: "BinaryExpression", operator, left, right: addExpr(state) };
    return left;
  }

  // (_ ("=" / "!=") _ ValueRangeExpr ("," ValueRangeExpr)*) )
  if (state.lookahead?.type === TokenTypes.EQUALS || state.lookahead?.type === TokenTypes.NOT_EQUALS) {
    eat(state.lookahead.type, state).value;
    const valueRanges: Array<AstNode> = [];
    const vr = valueRangeExpr(state);
    valueRanges.push(vr);
    while (state.lookahead !== null && (state.lookahead.type as ",") === TokenTypes.COMMA) {
      eat(TokenTypes.COMMA, state).value;
      const vr = valueRangeExpr(state);
      valueRanges.push(vr);
    }
    return { type: "ValueRanges", ranges: valueRanges };
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
  if (state.lookahead?.type === TokenTypes.PLUS || state.lookahead?.type === TokenTypes.MINUS) {
    eat(state.lookahead?.type, state);
    const right = addExpr(state);
    return { type: "BinaryExpression", operator: state.lookahead?.type as MathOperator, left, right };
  }
  return left;
}

function multiplyExpr(state: ParseState): UnaryExpression | BinaryExpression | Identifier | Numeric {
  // MultiplyExpr =	( (UnaryExpr _ ("*" / "/") _ MultiplyExpr)  ) / UnaryExpr
  let left = unaryExpr(state);
  if (state.lookahead?.type === TokenTypes.STAR || state.lookahead?.type === TokenTypes.DIVIDE) {
    eat(state.lookahead?.type, state);
    const right = multiplyExpr(state);
    return { type: "BinaryExpression", operator: state.lookahead?.type as MathOperator, left, right };
  }
  return left;
}

function unaryExpr(state: ParseState): UnaryExpression | Identifier | Numeric {
  // UnaryExpr  = ( ("-" ValueExpr) ) / ValueExpr;
  if (state.lookahead?.type === TokenTypes.MINUS) {
    eat(TokenTypes.MINUS, state);
    return { type: "UnaryExpression", value: valueExpr(state) };
  }
  return valueExpr(state);
}

function valueExpr(state: ParseState): Identifier | Numeric {
  // ValueExpr  = "null" / ident (":" ident)? / propval
  if (state.lookahead?.type === TokenTypes.IDENTIFIER) {
    const token = eat(TokenTypes.IDENTIFIER, state);
    return { type: "Identifier", name: token.value, value: token.value };
  }

  const token = eat(TokenTypes.NUMBER, state);
  return { type: "Numeric", value: Number(token.value) };
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
