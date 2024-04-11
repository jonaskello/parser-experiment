export type Token = {
  type: string;
  value: string;
};

export const TokenTypes = {
  NUMBER: "NUMBER",
  IDENTIFIER: "IDENTIFIER",
  ADDITION: "+",
  SUBTRACTION: "-",
  MULTIPLICATION: "*",
  DIVISION: "/",
  EXPONENTIATION: "^",
  PARENTHESIS_LEFT: "(",
  PARENTHESIS_RIGHT: ")",
};

const isNumeric = (c: string) => !isNaN(parseInt(c));
const isLetter = (c: string) => {
  const code = c.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};
const isWhitespace = (c: string) => c === " ";

export type TokenizeState = {
  cursor: number;
};

export function getNextToken(
  input: string,
  state: TokenizeState
): Token | null {
  if (state.cursor > input.length - 1) {
    return null;
  }
  // Skip whitespace
  if (isWhitespace(input[state.cursor])) {
    console.log("whitespace");
    state.cursor++;
    while (state.cursor < input.length && isWhitespace(input[state.cursor])) {
      state.cursor++;
    }
  }
  console.log("state", state);

  if (isNumeric(input[state.cursor])) {
    let number = input[state.cursor++];
    while (state.cursor < input.length && isNumeric(input[state.cursor])) {
      number += input[state.cursor++];
    }
    return { type: TokenTypes.NUMBER, value: number };
  } else if (isLetter(input[state.cursor])) {
    let identifier = input[state.cursor++];
    while (state.cursor < input.length && isNumeric(input[state.cursor])) {
      identifier += input[state.cursor++];
    }
    return { type: TokenTypes.IDENTIFIER, value: identifier };
  } else {
    const c = input[state.cursor++];
    switch (c) {
      case "+":
        return { type: TokenTypes.ADDITION, value: c };
      case "-":
        return { type: TokenTypes.SUBTRACTION, value: c };
      case "*":
        return { type: TokenTypes.MULTIPLICATION, value: c };
      case "/":
        return { type: TokenTypes.DIVISION, value: c };
      case "^":
        return { type: TokenTypes.EXPONENTIATION, value: c };
      case "(":
        return { type: TokenTypes.PARENTHESIS_LEFT, value: c };
      case ")":
        return { type: TokenTypes.PARENTHESIS_RIGHT, value: c };
      default:
        throw new SyntaxError(`Unexpected token: "${c}"`);
    }
  }
}
