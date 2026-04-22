export interface Serializer {
  serialize(data: any): any
}

export interface Deserializer {
  deserialize(data: any): any
}
