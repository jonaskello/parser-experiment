import { Token, TokenTypes, TokenizeState, getNextToken } from "./tokenizer";

type ParseState = {
  input: string;
  tokenizeState: TokenizeState;
};

let lookahead: Token | null;

export function parse(input: string) {
  const state: ParseState = { tokenizeState: { cursor: 0 }, input };
  lookahead = getNextToken(input, state.tokenizeState);

  return Expression(state);
}

function eat(tokenType, state: ParseState) {
  const token = lookahead;

  if (token == null) {
    throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`);
  }

  if (token.type !== tokenType) {
    throw new SyntaxError(
      `Unexpected token: "${token.value}", expected "${tokenType}"`
    );
  }

  // lookahead = tokens[tokenIndex++];
  lookahead = getNextToken(state.input, state.tokenizeState);
  console.log("lookahead", lookahead);

  return token;
}

function BinaryExpression(
  state: ParseState,
  leftRule,
  rightRule,
  operatorType1,
  operatorType2?
) {
  let left = leftRule(state);

  while (
    lookahead &&
    (lookahead.type === operatorType1 || lookahead.type === operatorType2)
  ) {
    const operator = eat(lookahead.type, state).value;
    left = {
      type: "BinaryExpression",
      operator,
      left,
      right: rightRule(state),
    };
  }

  return left;
}

function Expression(state: ParseState) {
  return BinaryExpression(
    state,
    Term,
    Term,
    TokenTypes.ADDITION,
    TokenTypes.SUBTRACTION
  );
}

function Term(state: ParseState) {
  return BinaryExpression(
    state,
    Factor,
    Factor,
    TokenTypes.MULTIPLICATION,
    TokenTypes.DIVISION
  );
}

function Factor(state: ParseState) {
  return BinaryExpression(state, Primary, Factor, TokenTypes.EXPONENTIATION);
}

function Primary(state: ParseState) {
  if (lookahead?.type === TokenTypes.PARENTHESIS_LEFT) {
    return ParenthesizedExpression(state);
  }

  if (lookahead?.type === TokenTypes.SUBTRACTION) {
    return UnaryExpression(state);
  }

  if (lookahead?.type === TokenTypes.IDENTIFIER) {
    return FunctionExpression(state);
  }

  const token = eat(TokenTypes.NUMBER, state);
  return {
    type: "Number",
    value: Number(token.value),
  };
}

function ParenthesizedExpression(state: ParseState) {
  eat(TokenTypes.PARENTHESIS_LEFT, state);
  const expression = Expression(state);
  eat(TokenTypes.PARENTHESIS_RIGHT, state);

  return expression;
}

function UnaryExpression(state: ParseState) {
  eat(TokenTypes.SUBTRACTION, state);
  return {
    type: "UnaryExpression",
    value: Factor(state),
  };
}

function FunctionExpression(state: ParseState) {
  const token = eat(TokenTypes.IDENTIFIER, state);
  return {
    type: "Function",
    name: token.value,
    value: ParenthesizedExpression(state),
  };
}
