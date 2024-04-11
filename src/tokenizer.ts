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

export function tokenize(input: string): ReadonlyArray<Token> {
  let cursor = 0;
  const tokens: Array<Token> = [];
  while (cursor < input.length) {
    if (isNumeric(input[cursor])) {
      let number = input[cursor++];
      while (cursor < input.length && isNumeric(input[cursor])) {
        number += input[cursor++];
      }
      tokens.push({ type: TokenTypes.NUMBER, value: number });
    } else if (isLetter(input[cursor])) {
      let identifier = input[cursor++];
      while (cursor < input.length && isNumeric(input[cursor])) {
        identifier += input[cursor++];
      }
      tokens.push({ type: TokenTypes.IDENTIFIER, value: identifier });
    } else {
      switch (input[cursor]) {
        case "+":
          tokens.push({ type: TokenTypes.ADDITION, value: input[cursor] });
          cursor++;
          break;
        case "-":
          tokens.push({ type: TokenTypes.SUBTRACTION, value: input[cursor] });
          cursor++;
          break;
        case "*":
          tokens.push({
            type: TokenTypes.MULTIPLICATION,
            value: input[cursor],
          });
          cursor++;
          break;
        case "/":
          tokens.push({ type: TokenTypes.DIVISION, value: input[cursor] });
          cursor++;
          break;
        case "^":
          tokens.push({
            type: TokenTypes.EXPONENTIATION,
            value: input[cursor],
          });
          cursor++;
          break;
        case "(":
          tokens.push({
            type: TokenTypes.PARENTHESIS_LEFT,
            value: input[cursor],
          });
          cursor++;
          break;
        case ")":
          tokens.push({
            type: TokenTypes.PARENTHESIS_RIGHT,
            value: input[cursor],
          });
          cursor++;
        case " ":
          cursor++;
          break;
        default:
          throw new SyntaxError(`Unexpected token: "${input[cursor]}"`);
      }
    }
  }
  return tokens;
}

export function tokenize2(input: string): ReadonlyArray<Token> {
  const tokens: Array<Token> = [];
  const state: TokenizeState = { cursor: 0 };

  while (state.cursor < input.length) {
    console.log("state.cursor", state.cursor);
    const t = getNextToken(input, state);
    console.log("t", t);
    if (t === null) {
      break;
    }
    tokens.push(t);
  }
  return tokens;
}

export type TokenizeState = {
  cursor: number;
};

export function getNextToken(
  input: string,
  state: TokenizeState
): Token | null {
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
