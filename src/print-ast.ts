import { AstNode } from "./ast";

export function printAst(node: AstNode, indent: string = ""): void {
  switch (node.type) {
    case "BinaryExpression":
      console.log(indent + "BinaryExpression - Operator: " + node.operator);
      console.log(indent + "Left:");
      printAst(node.left, indent + "  ");
      console.log(indent + "Right:");
      printAst(node.right, indent + "  ");
      break;
    case "ValueRanges":
      console.log(indent + "ValueRanges");
      node.ranges.forEach((range) => printAst(range, indent + "  "));
      break;
    case "ValueRangeExpr":
      console.log(indent + "ValueRangeExpr");
      console.log(indent + "Min:");
      printAst(node.min, indent + "  ");
      console.log(indent + "Max:");
      printAst(node.max, indent + "  ");
      break;
    case "UnaryExpression":
      console.log(indent + "UnaryExpression");
      console.log(indent + "Value:");
      printAst(node.value as AstNode, indent + "  ");
      break;
    case "Identifier":
      console.log(indent + "Identifier - Name: " + node.name + ", Value: " + node.value);
      break;
    case "Numeric":
      console.log(indent + "Numeric - Value: " + node.value);
      break;
    default:
      throw new Error("Invalid AST node type: " + (node as any).type);
  }
}
