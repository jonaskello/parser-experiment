// All expression
export type Expr = BooleanExpr | PropertyValueExpr | ValueRangeExpr;

// Expressions that result in a boolean
export type BooleanExpr = OrExpr | AndExpr | EqualsExpr | ComparisonExpr | EmptyExpr;

export type PropertyValueExpr = IdentifierExpr | ValueExpr | NullExpr | AddExpr | MulExpr | UnaryExpr;

export type EmptyExpr = Readonly<{ type: "EmptyExpr" }>;
export type NullExpr = Readonly<{ type: "NullExpr" }>;
export type EqualsExpr = Readonly<{ type: "EqualsExpr"; leftValue: Expr; operationType: EqualsOperationType; rightValueRanges: ReadonlyArray<Expr> }>;
export type EqualsOperationType = "equals" | "notEquals";
export type AddExpr = Readonly<{ type: "AddExpr"; left: Expr; operationType: AddExprOperationType; right: Expr }>;
export type AddExprOperationType = "add" | "subtract";
export type MulExpr = Readonly<{ type: "MulExpr"; left: Expr; operationType: MulExprOperationType; right: Expr }>;
export type MulExprOperationType = "multiply" | "divide";
export type OrExpr = Readonly<{ type: "OrExpr"; children: ReadonlyArray<Expr> }>;
export type AndExpr = Readonly<{ type: "AndExpr"; left: Expr; right: Expr }>;
export type ComparisonExpr = Readonly<{ type: "ComparisonExpr"; leftValue: Expr; operationType: ComparisonOperationType; rightValue: Expr }>;
export type ComparisonOperationType = "greater" | "less" | "greaterOrEqual" | "lessOrEqual";
export type ValueRangeExpr = Readonly<{ type: "ValueRangeExpr"; min: Expr; max: Expr }>;
export type UnaryExpr = Readonly<{ type: "UnaryExpr"; value: IdentifierExpr | ValueExpr }>;
export type IdentifierExpr = Readonly<{ type: "IdentifierExpr"; name: string; value: string }>;
export type ValueExpr = Readonly<{ type: "ValueExpr"; value: number }>;
