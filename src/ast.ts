export type AstNode =
  | OrExpr
  | AndExpr
  | AddExpr
  | MulExpr
  | ComparisonExpr
  | EqualsExpr
  | UnaryExpr
  | IdentifierExpr
  | Numeric
  | ValueRanges
  | ValueRangeExpr;

// // All expression
// export type Expr = BooleanExpr | PropertyValueExpr | ValueRangeExpr;

// Expressions that result in a boolean
export type BooleanExpr = OrExpr | AndExpr | EqualsExpr | ComparisonExpr | EmptyExpr;

// export type PropertyValueExpr = IdentifierExpr | ValueExpr | NullExpr | AddExpr | MulExpr | UnaryExpr;

export type EmptyExpr = {
  readonly type: "EmptyExpr";
};

export type EqualsExpr = {
  readonly type: "EqualsExpr";
  readonly leftValue: AstNode;
  readonly operationType: EqualsOperationType;
  // readonly rightValueRanges: ReadonlyArray<ValueRangeExpr>;
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
export type OrExpr = {
  type: "OrExpr";
  left: AstNode;
  right: AstNode;
};
export type AndExpr = {
  type: "AndExpr";
  left: AstNode;
  right: AstNode;
};
export type ComparisonExpr = {
  readonly type: "ComparisonExpr";
  readonly leftValue: AstNode;
  readonly operationType: ComparisonOperationType;
  readonly rightValue: AstNode;
};
export type ComparisonOperationType = "greater" | "less" | "greaterOrEqual" | "lessOrEqual";
export type ValueRanges = { type: "ValueRanges"; ranges: Array<AstNode> };
export type ValueRangeExpr = { type: "ValueRangeExpr"; min: AstNode; max: AstNode };
export type UnaryExpr = { type: "UnaryExpr"; value: IdentifierExpr | Numeric };
export type IdentifierExpr = { type: "IdentifierExpr"; name: string; value: string };
export type Numeric = { type: "Numeric"; value: number };

/*
type ParserCallbacks = {
  createValueExpr(unparsed: string): Ast.ValueExpr;
  createNullExpr(): Ast.NullExpr;
  createIdentifierExpr(identToken: string): Ast.IdentifierExpr;
  createValueRangeExpr(v1: Ast.PropertyValueExpr, v2: Ast.PropertyValueExpr): Ast.ValueRangeExpr;
  createEqualsExpr(
    leftValue: Ast.PropertyValueExpr,
    operationType: Ast.EqualsOperationType,
    rightValueRanges: ReadonlyArray<Ast.ValueRangeExpr>
  ): Ast.EqualsExpr;
  createComparisonExpr(
    leftValue: Ast.PropertyValueExpr,
    operationType: Ast.ComparisonOperationType,
    rightValue: Ast.PropertyValueExpr
  ): Ast.ComparisonExpr;
  createAndExpr(children: ReadonlyArray<Ast.BooleanExpr>): Ast.AndExpr;
  createOrExpr(children: ReadonlyArray<Ast.BooleanExpr>): Ast.OrExpr;
  createAddExpr(
    left: Ast.PropertyValueExpr,
    operationType: Ast.AddExprOperationType,
    right: Ast.PropertyValueExpr
  ): Ast.AddExpr;
  createMulExpr(
    left: Ast.PropertyValueExpr,
    operationType: Ast.MulExprOperationType,
    right: Ast.PropertyValueExpr
  ): Ast.MulExpr;
  createUnaryExpr(operationType: Ast.UnaryExprOperationType, value: Ast.PropertyValueExpr): Ast.UnaryExpr;
};


*/
