import { Token, TokenTypes, TokenizeState, getNextToken } from "./tokenizer";

type ParseState = {
  input: string;
  lookahead: Token | null;
  tokenizeState: TokenizeState;
};

type AstNode = {
  type: string;
  value: string;
};

export function parse(input: string): AstNode {
  const state: ParseState = { tokenizeState: { cursor: 0 }, input, lookahead: null };

  state.lookahead = getNextToken(input, state.tokenizeState);

  return orExpr(state);
}

function orExpr(state: ParseState) {
  // OrExpr = AndExpr (_ "|" _ i:AndExpr)*
  return binaryExpression(state, andExpr, andExpr, TokenTypes.OR);
}

function andExpr(state: ParseState) {
  // AndExpr = Expr (_ "&" _ Expr)*
  return binaryExpression(state, expr, expr, TokenTypes.AND);
}

function expr(state: ParseState) {
  // Expr  = ("(" OrExpr ")")  /	ComparisonExpr
  if (state.lookahead?.type === TokenTypes.PARENTHESIS_LEFT) {
    eat(TokenTypes.PARENTHESIS_LEFT, state);
    const expression = orExpr(state);
    eat(TokenTypes.PARENTHESIS_RIGHT, state);
    return expression;
  }
  return comparisonExpr(state);
}

function comparisonExpr(state: ParseState): AstNode {
  // ComparisonExpr = ( AddExpr ( (_ (">=" / "<=" / ">" / "<") _ AddExpr) / (_ ("=" / "!=") _ ValueRangeExpr ("," ValueRangeExpr)*) ) )
  return binaryExpression(state, addExpr, valueRangeExpr, TokenTypes.EQUALS);
}

function valueRangeExpr(state: ParseState): AstNode {
  // ValueRangeExpr = AddExpr (_ "~" _ AddExpr)?
  return addExpr(state);
}

function addExpr(state: ParseState): AstNode {
  // AddExpr =	( (MultiplyExpr _ ("+" / "-") _ AddExpr) ) / MultiplyExpr
  return binaryExpression(state, multiplyExpr, addExpr, TokenTypes.ADDITION, TokenTypes.SUBTRACTION);
}

function multiplyExpr(state: ParseState) {
  // MultiplyExpr =	( (UnaryExpr _ ("*" / "/") _ MultiplyExpr)  ) / UnaryExpr
  return binaryExpression(state, unaryExpr, multiplyExpr, TokenTypes.MULTIPLICATION, TokenTypes.DIVISION);
}

function unaryExpr(state: ParseState) {
  // UnaryExpr  = ( ("-" ValueExpr) ) / ValueExpr;
  if (state.lookahead?.type === TokenTypes.SUBTRACTION) {
    eat(TokenTypes.SUBTRACTION, state);
    return { type: "UnaryExpression", value: valueExpr(state) };
  }
  return valueExpr(state);
}

function valueExpr(state: ParseState) {
  // ValueExpr  = "null" / ident (":" ident)? / propval
  if (state.lookahead?.type === TokenTypes.IDENTIFIER) {
    const token = eat(TokenTypes.IDENTIFIER, state);
    return { type: "Identifier", name: token.value, value: token.value };
  }

  const token = eat(TokenTypes.NUMBER, state);
  return { type: "Number", value: Number(token.value) };
}

function binaryExpression(state: ParseState, leftRule, rightRule, operatorType1, operatorType2?) {
  let left = leftRule(state);

  while (state.lookahead !== null && (state.lookahead.type === operatorType1 || state.lookahead.type === operatorType2)) {
    const operator = eat(state.lookahead.type, state).value;
    left = { type: "BinaryExpression", operator, left, right: rightRule(state) };
  }

  return left;
}

function eat(tokenType: string, state: ParseState) {
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
