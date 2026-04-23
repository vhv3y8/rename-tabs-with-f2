export type Result<T, E> =
  | {
      ok: true
      value: T
      match: <R>(cases: { ok: (value: T) => R; err: (error: E) => R }) => R
    }
  | {
      ok: false
      error: E
      match: <R>(cases: { ok: (value: T) => R; err: (error: E) => R }) => R
    }

export function ok<T, E = never>(value: T): Result<T, E> {
  return {
    ok: true,
    value,
    match: (cases) => cases.ok(value),
  }
}

export function err<E, T = never>(error: E): Result<T, E> {
  return {
    ok: false,
    error,
    match: (cases) => cases.err(error),
  }
}
