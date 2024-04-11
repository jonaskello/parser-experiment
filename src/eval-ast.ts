import { AstNode, BinaryExpression, UnaryExpr } from "./ast";

export function evalAst(node: AstNode): boolean {
  switch (node.type) {
    case "BinaryExpression":
      return evalBinaryExpression(node);
    case "UnaryExpression":
      return evalUnaryExpression(node);
    case "Identifier":
      // Since there's no context for evaluation, let's assume identifiers are always true
      return true;
    case "Numeric":
      return node.value !== 0;
    // Handling for other types can be added here as needed
    case "ValueRangeExpr":
      throw new Error("TODO");
    case "ValueRanges":
      let final: boolean = false;
      for (const x of node.ranges) {
        final = evalAst(x);
      }
      return final;
    default:
      throw new Error("Invalid AST node type: " + (node as any).type);
  }
}

function evalBinaryExpression(node: BinaryExpression): boolean {
  const leftValue = evalAst(node.left);
  const rightValue = evalAst(node.right);

  switch (node.operator) {
    case "&":
      return leftValue && rightValue;
    case "|":
      return leftValue || rightValue;
    case "+":
      return leftValue || rightValue;
    case "-":
      return leftValue && !rightValue;
    case "*":
      return leftValue && rightValue;
    case "/":
      return leftValue || !rightValue;
    case "=":
      return leftValue || !rightValue;
    case ">":
      return leftValue > rightValue;
    case ">=":
      return leftValue >= rightValue;
    case "<":
      return leftValue < rightValue;
    case "<=":
      return leftValue <= rightValue;
    default:
      throw new Error("Invalid operator: " + node.operator);
  }
}

function evalUnaryExpression(node: UnaryExpr): boolean {
  const value = node.value.type === "Numeric" ? node.value.value : 0; // Assuming only Numeric types for unary expressions
  // Custom logic for unary expression evaluation
  // Let's say we consider negative numbers as false and positive numbers as true
  return value >= 0;
}
