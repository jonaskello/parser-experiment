// import { Amount } from "uom";
import * as Ast from "./ast";

export type PropertyType = "amount" | "text" | "integer";

export type Amount<TQuantity> = {
  readonly unit: { readonly quantity: string };
  readonly value: number;
};

export interface AmountPropertyValue {
  readonly type: "amount";
  readonly value: Amount<unknown>;
}

export interface TextPropertyValue {
  readonly type: "text";
  readonly value: string;
}

export interface IntegerPropertyValue {
  readonly type: "integer";
  readonly value: number;
}
export type PropertyValue = AmountPropertyValue | TextPropertyValue | IntegerPropertyValue;

export type Comparer = (left: PropertyValue, right: PropertyValue) => number;
export const defaultComparer: Comparer = (left: PropertyValue, right: PropertyValue) => _compare(left, right);

export type PropertyValueSet = Record<string, PropertyValue>;

export function evaluateAst(
  e: Ast.BooleanExpr,
  properties: PropertyValueSet,
  matchMissingIdentifiers: boolean,
  comparer: Comparer = defaultComparer
): boolean {
  switch (e.type) {
    case "AndExpr": {
      for (const child of e.children) {
        if (!evaluateAst(child, properties, matchMissingIdentifiers, comparer)) {
          return false;
        }
      }
      return true;
    }
    case "OrExpr": {
      for (const child of e.children) {
        if (evaluateAst(child, properties, matchMissingIdentifiers, comparer)) {
          return true;
        }
      }
      return false;
    }
    case "EqualsExpr": {
      // Handle match missing identifier
      if (matchMissingIdentifiers) {
        if (
          _isMissingIdent(e.leftValue, properties) ||
          e.rightValueRanges.filter((vr: Ast.ValueRangeExpr) => _isMissingIdent(vr.min, properties) || _isMissingIdent(vr.max, properties)).length > 0
        ) {
          return true;
        }
      }

      const left = evaluatePropertyValueExpr(e.leftValue, properties);

      for (const range of e.rightValueRanges) {
        const min = evaluatePropertyValueExpr(range.min, properties);
        const max = evaluatePropertyValueExpr(range.max, properties);

        // Match on NULL or inclusive in range
        if (
          ((max === null || min === null) && left === null) ||
          (left !== null && min !== null && max !== null && greaterOrEqualTo(left, min, comparer) && lessOrEqualTo(left, max, comparer))
        ) {
          return e.operationType === "equals";
        }
      }

      return e.operationType === "notEquals";
    }
    case "ComparisonExpr": {
      // Handle match missing identifier
      if (matchMissingIdentifiers && (_isMissingIdent(e.leftValue, properties) || _isMissingIdent(e.rightValue, properties))) {
        return true;
      }

      const left = evaluatePropertyValueExpr(e.leftValue, properties);
      if (left === null) {
        return false;
      }

      const right = evaluatePropertyValueExpr(e.rightValue, properties);
      if (right === null) {
        return false;
      }

      switch (e.operationType) {
        case "less":
          return lessThan(left, right, comparer);
        case "greater":
          return greaterThan(left, right, comparer);
        case "lessOrEqual":
          return lessOrEqualTo(left, right, comparer);
        case "greaterOrEqual":
          return greaterOrEqualTo(left, right, comparer);
        default:
          throw new Error(`Unknown comparisontype`);
      }
    }
    case "EmptyExpr": {
      return true;
    }
    default: {
      return exhaustiveCheck(e, true);
    }
  }
}

function evaluatePropertyValueExpr(e: Ast.PropertyValueExpr, properties: PropertyValueSet): PropertyValue | null {
  switch (e.type) {
    case "IdentifierExpr": {
      //   const pv = PropertyValueSet.get(e.name, properties);
      const pv = properties[e.name];
      return pv || null;
    }
    case "ValueExpr": {
      return e.parsed;
    }
    case "NullExpr": {
      return null;
    }
    case "AddExpr": {
      const left = evaluatePropertyValueExpr(e.left, properties);
      const right = evaluatePropertyValueExpr(e.right, properties);
      if (!left) {
        return right;
      }
      if (!right) {
        return left;
      }
      if (left.type === "integer" && right.type === "integer") {
        if (e.operationType === "add") {
          return fromInteger(left.value + right.value);
        } else {
          return fromInteger(left.value - right.value);
        }
      } else if (left.type === "text" && right.type === "text") {
        if (e.operationType === "add") {
          return fromText(left.value + right.value);
        } else {
          return null;
        }
      } else if (left.type === "amount" && right.type === "amount") {
        if (e.operationType === "add") {
          return fromAmount(Amount.plus(left.value, right.value));
        } else {
          return fromAmount(Amount.minus(left.value, right.value));
        }
      }
      return null;
    }
    case "MulExpr": {
      const left = evaluatePropertyValueExpr(e.left, properties);
      const right = evaluatePropertyValueExpr(e.right, properties);
      if (!left || !right) {
        return null;
      }
      if (left.type === "integer" && right.type === "integer") {
        if (e.operationType === "multiply") {
          return fromInteger(left.value * right.value);
        } else {
          return fromInteger(left.value / right.value);
        }
      } else if (left.type === "amount" && right.type === "integer") {
        if (e.operationType === "multiply") {
          return fromAmount(Amount.times(left.value, right.value));
        } else {
          return fromAmount(Amount.divide(left.value, right.value));
        }
      } else if (left.type === "integer" && right.type === "amount") {
        if (e.operationType === "multiply") {
          return fromAmount(Amount.times(right.value, left.value));
        }
      }
      return null;
    }
    case "UnaryExpr": {
      const value = evaluatePropertyValueExpr(e.value, properties);
      if (!value || value.type === "text") {
        return null;
      }
      if (value.type === "integer") {
        return fromInteger(-value.value);
      } else {
        return fromAmount(Amount.neg(value.value));
      }
    }
    default: {
      return exhaustiveCheck(e, true);
    }
  }
}

function _isMissingIdent(e: Ast.PropertyValueExpr, properties: PropertyValueSet): boolean {
  // If expression is an missing identifier it should match anything
  if (e.type === "IdentifierExpr") {
    // if (!PropertyValueSet.hasProperty(e.name, properties)) {
    if (properties[e.name] === undefined) {
      return true;
    }
  }
  return false;
}

export function equals(left: PropertyValue, right: PropertyValue, comparer: Comparer = defaultComparer): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) === 0;
}

export function lessThan(left: PropertyValue, right: PropertyValue, comparer: Comparer = defaultComparer): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) < 0;
}

export function lessOrEqualTo(left: PropertyValue, right: PropertyValue, comparer: Comparer = defaultComparer): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) <= 0;
}

export function greaterThan(left: PropertyValue, right: PropertyValue, comparer: Comparer = defaultComparer): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) > 0;
}

export function greaterOrEqualTo(left: PropertyValue, right: PropertyValue, comparer: Comparer = defaultComparer): boolean {
  if (left === undefined || right === undefined) {
    return false;
  }
  if (right.type !== left.type) {
    return false;
  }
  return comparer(left, right) >= 0;
}

function _compare(left: PropertyValue, right: PropertyValue): number {
  switch (left.type) {
    case "integer":
      if (right.type === "integer") {
        return compareNumbers(left.value, right.value, 0, 0);
      }
      throw new Error("Unexpected error comparing integers");
    case "amount":
      if (right.type === "amount") {
        return Amount.compareTo(left.value, right.value);
      }
      throw new Error("Unexpected error comparing amounts");
    case "text":
      if (right.type === "text") {
        return compareIgnoreCase(left.value, right.value);
      }
      throw new Error("Unexpected error comparing texts");
    default:
      throw new Error("Unknown property type");
  }
}

export function fromInteger(integerValue: number): PropertyValue {
  return { type: "integer", value: integerValue } as PropertyValue;
}

export function fromText(textValue: string): PropertyValue {
  if (textValue === null) {
    throw new Error("value");
  }
  return { type: "text", value: textValue } as PropertyValue;
}

export function fromAmount(amountValue: Amount<unknown>): PropertyValue {
  if (!amountValue) {
    throw new Error("null: value");
  }
  if (amountValue.unit.quantity === "Discrete") {
    return {
      type: "integer",
      value: amountValue.value,
    };
  } else {
    return { type: "amount", value: amountValue };
  }
}

export function exhaustiveCheck(check: never, throwError: boolean = false): never {
  if (throwError) {
    throw new Error(`ERROR! The value ${JSON.stringify(check)} should be of type never.`);
  }
  return check;
}
