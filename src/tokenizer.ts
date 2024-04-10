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

const isNumeric = (char: string) => !isNaN(parseInt(char));
const isLetter = (char: string) => {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

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
