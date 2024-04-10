import { Token, TokenTypes, Tokenizer } from "./tokenizer";

export function parse(input: string) {
  let lookahead: Token | null;
  let tokenizer: Tokenizer;

  function eat(tokenType) {
    const token = lookahead;

    if (token == null) {
      throw new SyntaxError(`Unexpected end of input, expected "${tokenType}"`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}", expected "${tokenType}"`
      );
    }

    lookahead = tokenizer.getNextToken();

    return token;
  }

  function BinaryExpression(
    leftRule,
    rightRule,
    operatorType1,
    operatorType2?
  ) {
    let left = leftRule();

    while (
      lookahead &&
      (lookahead.type === operatorType1 || lookahead.type === operatorType2)
    ) {
      const operator = eat(lookahead.type).value;
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right: rightRule(),
      };
    }

    return left;
  }

  function Expression() {
    return BinaryExpression(
      Term,
      Term,
      TokenTypes.ADDITION,
      TokenTypes.SUBTRACTION
    );
  }

  function Term() {
    return BinaryExpression(
      Factor,
      Factor,
      TokenTypes.MULTIPLICATION,
      TokenTypes.DIVISION
    );
  }

  function Factor() {
    return BinaryExpression(Primary, Factor, TokenTypes.EXPONENTIATION);
  }

  function Primary() {
    if (lookahead?.type === TokenTypes.PARENTHESIS_LEFT) {
      return ParenthesizedExpression();
    }

    if (lookahead?.type === TokenTypes.SUBTRACTION) {
      return UnaryExpression();
    }

    if (lookahead?.type === TokenTypes.IDENTIFIER) {
      return FunctionExpression();
    }

    const token = eat(TokenTypes.NUMBER);
    return {
      type: "Number",
      value: Number(token.value),
    };
  }

  function ParenthesizedExpression() {
    eat(TokenTypes.PARENTHESIS_LEFT);
    const expression = Expression();
    eat(TokenTypes.PARENTHESIS_RIGHT);

    return expression;
  }

  function UnaryExpression() {
    eat(TokenTypes.SUBTRACTION);
    return {
      type: "UnaryExpression",
      value: Factor(),
    };
  }

  function FunctionExpression() {
    const token = eat(TokenTypes.IDENTIFIER);
    return {
      type: "Function",
      name: token.value,
      value: ParenthesizedExpression(),
    };
  }

  tokenizer = new Tokenizer(input);
  lookahead = tokenizer.getNextToken();

  return Expression();
}
