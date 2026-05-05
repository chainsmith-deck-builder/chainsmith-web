// Error-shape helpers for the openapi-fetch client. Per
// .claude/rules/api-client.md, error bodies match `{ error: { code, message,
// details? } }` and the `code` is a string union from the schema. Switching
// on `code` should be exhaustive at every call site.

import type { ErrorBody, ErrorCode } from './types';

export function isErrorBody(value: unknown): value is ErrorBody {
  if (value === null || typeof value !== 'object') return false;
  const inner = (value as { error?: unknown }).error;
  if (inner === null || typeof inner !== 'object') return false;
  const code = (inner as { code?: unknown }).code;
  return typeof code === 'string';
}

export function errorCodeOf(value: unknown): ErrorCode | null {
  return isErrorBody(value) ? value.error.code : null;
}

// Compile-time exhaustiveness assert for switch statements over ErrorCode.
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminant: ${String(value)}`);
}
