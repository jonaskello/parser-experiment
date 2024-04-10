import { Token, TokenTypes, tokenize } from "./tokenizer2";

let lookahead: Token;
let tokenIndex = 0;

export function parse(input: string) {
  const tokens = tokenize(input);

  console.log("tokens", tokens);

  lookahead = tokens[tokenIndex++];

  return Expression(tokens);
}

function eat(tokenType, tokens) {
  console.log("tokens", tokens);
  const token = lookahead;

  if (token == null) {
    throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`);
  }

  if (token.type !== tokenType) {
    throw new SyntaxError(
      `Unexpected token: "${token.value}", expected "${tokenType}"`
    );
  }

  lookahead = tokens[tokenIndex++];

  return token;
}

function BinaryExpression(
  tokens: ReadonlyArray<Token>,
  leftRule,
  rightRule,
  operatorType1,
  operatorType2?
) {
  let left = leftRule(tokens);

  while (
    lookahead &&
    (lookahead.type === operatorType1 || lookahead.type === operatorType2)
  ) {
    const operator = eat(lookahead.type, tokens).value;
    left = {
      type: "BinaryExpression",
      operator,
      left,
      right: rightRule(tokens),
    };
  }

  return left;
}

function Expression(tokens: ReadonlyArray<Token>) {
  return BinaryExpression(
    tokens,
    Term,
    Term,
    TokenTypes.ADDITION,
    TokenTypes.SUBTRACTION
  );
}

function Term(tokens: ReadonlyArray<Token>) {
  return BinaryExpression(
    tokens,
    Factor,
    Factor,
    TokenTypes.MULTIPLICATION,
    TokenTypes.DIVISION
  );
}

function Factor(tokens: ReadonlyArray<Token>) {
  return BinaryExpression(tokens, Primary, Factor, TokenTypes.EXPONENTIATION);
}

function Primary(tokens: ReadonlyArray<Token>) {
  if (lookahead?.type === TokenTypes.PARENTHESIS_LEFT) {
    return ParenthesizedExpression(tokens);
  }

  if (lookahead?.type === TokenTypes.SUBTRACTION) {
    return UnaryExpression(tokens);
  }

  if (lookahead?.type === TokenTypes.IDENTIFIER) {
    return FunctionExpression(tokens);
  }

  const token = eat(TokenTypes.NUMBER, tokens);
  return {
    type: "Number",
    value: Number(token.value),
  };
}

function ParenthesizedExpression(tokens: ReadonlyArray<Token>) {
  eat(TokenTypes.PARENTHESIS_LEFT, tokens);
  const expression = Expression(tokens);
  eat(TokenTypes.PARENTHESIS_RIGHT, tokens);

  return expression;
}

function UnaryExpression(tokens: ReadonlyArray<Token>) {
  eat(TokenTypes.SUBTRACTION, tokens);
  return {
    type: "UnaryExpression",
    value: Factor(tokens),
  };
}

function FunctionExpression(tokens: ReadonlyArray<Token>) {
  const token = eat(TokenTypes.IDENTIFIER, tokens);
  return {
    type: "Function",
    name: token.value,
    value: ParenthesizedExpression(tokens),
  };
}
