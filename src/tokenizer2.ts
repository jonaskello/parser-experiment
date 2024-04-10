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

const TokenSpec: ReadonlyArray<[RegExp, string | null]> = [
  [/^\s+/, null],
  [/^(?:\d+(?:\.\d*)?|\.\d+)/, TokenTypes.NUMBER],
  [/^[a-z]+/, TokenTypes.IDENTIFIER],
  [/^\+/, TokenTypes.ADDITION],
  [/^\-/, TokenTypes.SUBTRACTION],
  [/^\*/, TokenTypes.MULTIPLICATION],
  [/^\//, TokenTypes.DIVISION],
  [/^\^/, TokenTypes.EXPONENTIATION],
  [/^\(/, TokenTypes.PARENTHESIS_LEFT],
  [/^\)/, TokenTypes.PARENTHESIS_RIGHT],
];

export function tokenize(input): ReadonlyArray<Token> {
  let cursor = 0;

  const tokens: Array<Token> = [];
  let t = getNextToken();
  while (t) {
    tokens.push(t);
    t = getNextToken();
  }
  return tokens;

  function match(regex, inputSlice) {
    const matched = regex.exec(inputSlice);
    if (matched === null) {
      return null;
    }

    cursor += matched[0].length;
    return matched[0];
  }

  function getNextToken(): Token | null {
    if (!(cursor < input.length)) {
      return null;
    }

    const inputSlice = input.slice(cursor);

    for (let [regex, type] of TokenSpec) {
      const tokenValue = match(regex, inputSlice);

      if (tokenValue === null) {
        continue;
      }

      if (type === null) {
        return getNextToken();
      }

      return {
        type,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Unexpected token: "${inputSlice[0]}"`);
  }
}
