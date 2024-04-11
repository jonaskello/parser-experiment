// All expression
export type Expr = BooleanExpr | PropertyValueExpr | ValueRangeExpr;

// Expressions that result in a boolean
export type BooleanExpr = OrExpr | AndExpr | EqualsExpr | ComparisonExpr | EmptyExpr;

export type PropertyValueExpr = IdentifierExpr | ValueExpr | NullExpr | AddExpr | MulExpr | UnaryExpr;

export type EmptyExpr = { readonly type: "EmptyExpr" };
export type NullExpr = { readonly type: "NullExpr" };
export type EqualsExpr = {
  readonly type: "EqualsExpr";
  readonly leftValue: Expr;
  readonly operationType: EqualsOperationType;
  readonly rightValueRanges: ReadonlyArray<Expr>;
};
export type EqualsOperationType = "equals" | "notEquals";
export type AddExpr = {
  readonly type: "AddExpr";
  readonly left: Expr;
  readonly operationType: AddExprOperationType;
  readonly right: Expr;
};
export type AddExprOperationType = "add" | "subtract";
export type MulExpr = {
  readonly type: "MulExpr";
  readonly left: Expr;
  readonly operationType: MulExprOperationType;
  readonly right: Expr;
};
export type MulExprOperationType = "multiply" | "divide";
export type OrExpr = { type: "OrExpr"; left: Expr; right: Expr };
export type AndExpr = { type: "AndExpr"; left: Expr; right: Expr };
export type ComparisonExpr = {
  readonly type: "ComparisonExpr";
  readonly leftValue: Expr;
  readonly operationType: ComparisonOperationType;
  readonly rightValue: Expr;
};
export type ComparisonOperationType = "greater" | "less" | "greaterOrEqual" | "lessOrEqual";
export type ValueRangeExpr = { type: "ValueRangeExpr"; min: Expr; max: Expr };
export type UnaryExpr = { type: "UnaryExpr"; value: IdentifierExpr | ValueExpr };
export type IdentifierExpr = { type: "IdentifierExpr"; name: string; value: string };
export type ValueExpr = { type: "ValueExpr"; value: number };
