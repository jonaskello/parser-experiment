// All expression
export type Expr = BooleanExpr | PropertyValueExpr | ValueRangeExpr;

// Expressions that result in a boolean
export type BooleanExpr = OrExpr | AndExpr | EqualsExpr | ComparisonExpr | EmptyExpr;

export type PropertyValueExpr = IdentifierExpr | ValueExpr | NullExpr | AddExpr | MulExpr | UnaryExpr;

export type EmptyExpr = Readonly<{ type: "EmptyExpr" }>;
export type NullExpr = Readonly<{ type: "NullExpr" }>;
export type EqualsExpr = Readonly<{
  type: "EqualsExpr";
  leftValue: PropertyValueExpr;
  operationType: EqualsOperationType;
  rightValueRanges: ReadonlyArray<ValueRangeExpr>;
}>;
export type EqualsOperationType = "equals" | "notEquals";
export type AddExpr = Readonly<{ type: "AddExpr"; left: PropertyValueExpr; operationType: AddExprOperationType; right: PropertyValueExpr }>;
export type AddExprOperationType = "add" | "subtract";
export type MulExpr = Readonly<{ type: "MulExpr"; left: PropertyValueExpr; operationType: MulExprOperationType; right: PropertyValueExpr }>;
export type MulExprOperationType = "multiply" | "divide";
export type OrExpr = Readonly<{ type: "OrExpr"; children: ReadonlyArray<BooleanExpr> }>;
export type AndExpr = Readonly<{ type: "AndExpr"; children: ReadonlyArray<BooleanExpr> }>;
export type ComparisonExpr = Readonly<{
  type: "ComparisonExpr";
  leftValue: PropertyValueExpr;
  operationType: ComparisonOperationType;
  rightValue: PropertyValueExpr;
}>;
export type ComparisonOperationType = "greater" | "less" | "greaterOrEqual" | "lessOrEqual";
export type ValueRangeExpr = Readonly<{ type: "ValueRangeExpr"; min: PropertyValueExpr; max: PropertyValueExpr }>;
export type UnaryExpr = Readonly<{ type: "UnaryExpr"; operationType: UnaryExprOperationType; value: PropertyValueExpr }>;
export type UnaryExprOperationType = "negative";
export type IdentifierExpr = Readonly<{ type: "IdentifierExpr"; name: string; value: string }>;
export type ValueExpr = Readonly<{ type: "ValueExpr"; unParsed: string; parsed: PropertyValue }>;

// PropertyValue
export type PropertyValue = AmountPropertyValue | TextPropertyValue | IntegerPropertyValue;
export type AmountPropertyValue = { readonly type: "amount" };
export type TextPropertyValue = { readonly type: "text"; readonly value: string };
export type IntegerPropertyValue = { readonly type: "integer"; readonly value: number };
