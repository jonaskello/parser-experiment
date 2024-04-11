/*

// ---- CHARACTERS ----

letter
  = [a-z]i
digit
	 = [0-9]
unescaped
  = [^\0-\x1F\x22\x5C]
identletter
  = letter / "." / "_"

// ----TOKENS ----

ident
  = $(identletter (identletter / digit)*)
propval
  = $('"' unescaped* '"')
  / $("-"? digit+ ("." digit+)? (":" letter+)?)

// optional whitespace
_  = [ ]*


*/

export type Token = {
  type: (typeof TokenTypes)[keyof typeof TokenTypes];
  value: string;
};

export const TokenTypes = {
  OR: "|",
  AND: "&",
  EQUALS: "=",
  NOT_EQUALS: "!=",
  GREATER_EQUALS: ">=",
  LESS_EQUALS: "<=",
  GREATER: ">",
  LESS: "<",
  ADDITION: "+",
  SUBTRACTION: "-",
  MULTIPLICATION: "*",
  DIVISION: "/",
  PARENTHESIS_LEFT: "(",
  PARENTHESIS_RIGHT: ")",
  COMMA: ",",
  TILDE: "~",
  NUMBER: "NUMBER",
  IDENTIFIER: "IDENTIFIER",
} as const;

const isNumeric = (c: string) => !isNaN(parseInt(c));
const isLetter = (c: string) => {
  const code = c.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};
const isWhitespace = (c: string) => c === " ";

export type TokenizeState = {
  cursor: number;
};

export function getNextToken(input: string, state: TokenizeState): Token | null {
  if (state.cursor > input.length - 1) {
    return null;
  }
  // Skip whitespace
  if (isWhitespace(input[state.cursor])) {
    state.cursor++;
    while (state.cursor < input.length && isWhitespace(input[state.cursor])) {
      state.cursor++;
    }
  }

  // Get next token
  if (isNumeric(input[state.cursor])) {
    let number = input[state.cursor++];
    while (state.cursor < input.length && isNumeric(input[state.cursor])) {
      number += input[state.cursor++];
    }
    return { type: TokenTypes.NUMBER, value: number };
  } else if (isLetter(input[state.cursor])) {
    let identifier = input[state.cursor++];
    while (state.cursor < input.length && isLetter(input[state.cursor])) {
      identifier += input[state.cursor++];
    }
    return { type: TokenTypes.IDENTIFIER, value: identifier };
  } else {
    const c = input[state.cursor++];
    switch (c) {
      case "|":
        return { type: TokenTypes.OR, value: c };
      case "&":
        return { type: TokenTypes.AND, value: c };
      case "=":
        return { type: TokenTypes.EQUALS, value: c };
      case ">": {
        if (input[state.cursor] === "=") {
          state.cursor++;
          return { type: TokenTypes.GREATER_EQUALS, value: ">=" };
        }
        return { type: TokenTypes.GREATER, value: c };
      }
      case "<": {
        if (input[state.cursor] === "=") {
          state.cursor++;
          return { type: TokenTypes.LESS_EQUALS, value: c };
        }
        return { type: TokenTypes.LESS, value: "<=" };
      }
      case "!": {
        if (input[state.cursor] === "=") {
          state.cursor++;
          return { type: TokenTypes.NOT_EQUALS, value: "!=" };
        }
        throw new SyntaxError(`Unexpected token: "${c}"`);
      }
      case "+":
        return { type: TokenTypes.ADDITION, value: c };
      case "-":
        return { type: TokenTypes.SUBTRACTION, value: c };
      case "*":
        return { type: TokenTypes.MULTIPLICATION, value: c };
      case "/":
        return { type: TokenTypes.DIVISION, value: c };
      case "(":
        return { type: TokenTypes.PARENTHESIS_LEFT, value: c };
      case ")":
        return { type: TokenTypes.PARENTHESIS_RIGHT, value: c };
      case ",":
        return { type: TokenTypes.COMMA, value: c };
      case "~":
        return { type: TokenTypes.TILDE, value: c };
      default:
        throw new SyntaxError(`Unexpected token: "${c}"`);
    }
  }
}
