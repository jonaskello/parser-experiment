import { Token, TokenTypes, TokenizeState, getNextToken } from "./tokenizer";

type ParseState = {
  input: string;
  lookahead: Token | null;
  tokenizeState: TokenizeState;
};

export function parse(input: string) {
  const state: ParseState = { tokenizeState: { cursor: 0 }, input, lookahead: null };

  state.lookahead = getNextToken(input, state.tokenizeState);

  return OrExpr(state);
}

function OrExpr(state: ParseState) {
  // OrExpr = AndExpr (_ "|" _ i:AndExpr)*
  return BinaryExpression(state, AndExpr, AndExpr, TokenTypes.OR);
}

function AndExpr(state: ParseState) {
  // AndExpr = Expr (_ "&" _ Expr)*
  return BinaryExpression(state, Expr, Expr, TokenTypes.AND);
}

function Expr(state: ParseState) {
  // Expr  = ("(" OrExpr ")")  /	ComparisonExpr
  if (state.lookahead?.type === TokenTypes.PARENTHESIS_LEFT) {
    eat(TokenTypes.PARENTHESIS_LEFT, state);
    const expression = OrExpr(state);
    eat(TokenTypes.PARENTHESIS_RIGHT, state);
    return expression;
  }
  return ComparisonExpr(state);
}

function ComparisonExpr(state: ParseState) {
  // ComparisonExpr = ( AddExpr ( (_ (">=" / "<=" / ">" / "<") _ AddExpr) / (_ ("=" / "!=") _ ValueRangeExpr ("," ValueRangeExpr)*) ) )
  return BinaryExpression(state, AddExpr, ValueRangeExpr, TokenTypes.EQUALS);
}

function ValueRangeExpr(state: ParseState) {
  // ValueRangeExpr = AddExpr (_ "~" _ AddExpr)?
  return AddExpr(state);
}

function AddExpr(state: ParseState) {
  // AddExpr =	( (MultiplyExpr _ ("+" / "-") _ AddExpr) ) / MultiplyExpr
  return BinaryExpression(state, MultiplyExpr, AddExpr, TokenTypes.ADDITION, TokenTypes.SUBTRACTION);
}

function MultiplyExpr(state: ParseState) {
  // MultiplyExpr =	( (UnaryExpr _ ("*" / "/") _ MultiplyExpr)  ) / UnaryExpr
  return BinaryExpression(state, UnaryExpr, MultiplyExpr, TokenTypes.MULTIPLICATION, TokenTypes.DIVISION);
}

function UnaryExpr(state: ParseState) {
  // UnaryExpr  = ( ("-" ValueExpr) ) / ValueExpr;
  if (state.lookahead?.type === TokenTypes.SUBTRACTION) {
    eat(TokenTypes.SUBTRACTION, state);
    return { type: "UnaryExpression", value: ValueExpr(state) };
  }
  return ValueExpr(state);
}

function ValueExpr(state: ParseState) {
  // ValueExpr  = "null" / ident (":" ident)? / propval
  if (state.lookahead?.type === TokenTypes.IDENTIFIER) {
    const token = eat(TokenTypes.IDENTIFIER, state);
    return { type: "Identifier", name: token.value, value: token.value };
  }

  const token = eat(TokenTypes.NUMBER, state);
  return { type: "Number", value: Number(token.value) };
}

function BinaryExpression(state: ParseState, leftRule, rightRule, operatorType1, operatorType2?) {
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
