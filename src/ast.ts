export type AstNode =
  | OrExpr
  | AndExpr
  | AddExpr
  | MulExpr
  | ComparisonExpr
  | EqualsExpr
  | EmptyExpr
  | NullExpr
  | UnaryExpr
  | IdentifierExpr
  | ValueExpr
  | ValueRangeExpr;

// All expression
export type Expr = BooleanExpr | PropertyValueExpr | ValueRangeExpr;

// Expressions that result in a boolean
export type BooleanExpr = OrExpr | AndExpr | EqualsExpr | ComparisonExpr | EmptyExpr;

export type PropertyValueExpr = IdentifierExpr | ValueExpr | NullExpr | AddExpr | MulExpr | UnaryExpr;

export type EmptyExpr = { readonly type: "EmptyExpr" };
export type NullExpr = { readonly type: "NullExpr" };
export type EqualsExpr = {
  readonly type: "EqualsExpr";
  readonly leftValue: AstNode;
  readonly operationType: EqualsOperationType;
  readonly rightValueRanges: ReadonlyArray<AstNode>;
};
export type EqualsOperationType = "equals" | "notEquals";
export type AddExpr = {
  readonly type: "AddExpr";
  readonly left: AstNode;
  readonly operationType: AddExprOperationType;
  readonly right: AstNode;
};
export type AddExprOperationType = "add" | "subtract";
export type MulExpr = {
  readonly type: "MulExpr";
  readonly left: AstNode;
  readonly operationType: MulExprOperationType;
  readonly right: AstNode;
};
export type MulExprOperationType = "multiply" | "divide";
export type OrExpr = { type: "OrExpr"; left: AstNode; right: AstNode };
export type AndExpr = { type: "AndExpr"; left: AstNode; right: AstNode };
export type ComparisonExpr = {
  readonly type: "ComparisonExpr";
  readonly leftValue: AstNode;
  readonly operationType: ComparisonOperationType;
  readonly rightValue: AstNode;
};
export type ComparisonOperationType = "greater" | "less" | "greaterOrEqual" | "lessOrEqual";
export type ValueRangeExpr = { type: "ValueRangeExpr"; min: AstNode; max: AstNode };
export type UnaryExpr = { type: "UnaryExpr"; value: IdentifierExpr | ValueExpr };
export type IdentifierExpr = { type: "IdentifierExpr"; name: string; value: string };
export type ValueExpr = { type: "ValueExpr"; value: number };
