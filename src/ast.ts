export type AstNode = BinaryExpression | UnaryExpression | Identifier | Numeric | ValueRanges | ValueRangeExpr;
export type BinaryExpression = { type: "BinaryExpression"; operator: string; left: AstNode; right: AstNode };
export type ValueRanges = { type: "ValueRanges"; ranges: Array<AstNode> };
export type ValueRangeExpr = { type: "ValueRangeExpr"; min: AstNode; max: AstNode };
export type UnaryExpression = { type: "UnaryExpression"; value: Identifier | Numeric };
export type Identifier = { type: "Identifier"; name: string; value: string };
export type Numeric = { type: "Numeric"; value: number };
