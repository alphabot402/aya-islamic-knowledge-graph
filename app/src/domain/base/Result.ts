/**
 * Result Type
 * Represents the result of an operation that can succeed or fail
 *
 * Used for error handling without throwing exceptions
 * Inspired by functional programming Result/Either types
 */

export class Result<T> {
  public isSuccess: boolean
  public isFailure: boolean
  public error?: string
  private _value?: T

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A result cannot be successful and contain an error')
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result needs to contain an error message')
    }

    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error
    this._value = value

    Object.freeze(this)
  }

  /**
   * Get the value (only if success)
   */
  public get value(): T {
    if (!this.isSuccess) {
      throw new Error("Can't get the value of an error result. Use 'errorValue' instead.")
    }

    return this._value as T
  }

  /**
   * Create a successful result
   */
  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value)
  }

  /**
   * Create a failed result
   */
  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error)
  }

  /**
   * Combine multiple results
   * Returns first failure or success if all succeed
   */
  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result
    }
    return Result.ok()
  }
}
