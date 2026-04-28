export interface Serializer<T, S> {
  serialize(data: T): S
  deserialize(data: S): T
}
