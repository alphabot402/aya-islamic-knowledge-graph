/**
 * Base Entity
 * Abstract base class for all entities in the domain
 *
 * Entities are objects with identity - they are defined by their ID
 * rather than their attributes
 */

export abstract class Entity<T> {
  protected readonly _id: string
  protected readonly props: T

  constructor(id: string, props: T) {
    this._id = id
    this.props = props
  }

  /**
   * Get entity ID
   */
  public get id(): string {
    return this._id
  }

  /**
   * Check equality with another entity (by ID)
   */
  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false
    }
    if (!(entity instanceof Entity)) {
      return false
    }
    return this._id === entity._id
  }
}
