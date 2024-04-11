export type AstNode = BinaryExpression | UnaryExpression | Identifier | Numeric | ValueRanges | ValueRangeExpr;
export type MathOperator = "+" | "-" | "/" | "*";
export type ComparisionOperator = "=" | ">" | ">=" | "<" | "<=";
export type LogicOperator = "&" | "|";
export type BinaryExpression = {
  type: "BinaryExpression";
  operator: MathOperator | ComparisionOperator | LogicOperator;
  left: AstNode;
  right: AstNode;
};
export type ValueRanges = { type: "ValueRanges"; ranges: Array<AstNode> };
export type ValueRangeExpr = { type: "ValueRangeExpr"; min: AstNode; max: AstNode };
export type UnaryExpression = { type: "UnaryExpression"; value: Identifier | Numeric };
export type Identifier = { type: "Identifier"; name: string; value: string };
export type Numeric = { type: "Numeric"; value: number };
