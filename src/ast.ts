export type AstNode = BinaryExpression | OrExpression | AndExpression | UnaryExpression | Identifier | Numeric | ValueRanges | ValueRangeExpr;
export type MathOperator = "+" | "-" | "/" | "*";
export type ComparisionOperator = "=" | ">" | ">=" | "<" | "<=";
export type LogicOperator = "&" | "|";
export type BinaryExpression = {
  type: "BinaryExpression";
  operator: MathOperator | ComparisionOperator | LogicOperator;
  left: AstNode;
  right: AstNode;
};

export type OrExpression = {
  type: "OrExpression";
  left: AstNode;
  right: AstNode;
};

export type AndExpression = {
  type: "AndExpression";
  left: AstNode;
  right: AstNode;
};

export type ValueRanges = { type: "ValueRanges"; ranges: Array<AstNode> };
export type ValueRangeExpr = { type: "ValueRangeExpr"; min: AstNode; max: AstNode };
export type UnaryExpression = { type: "UnaryExpression"; value: Identifier | Numeric };
export type Identifier = { type: "Identifier"; name: string; value: string };
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
