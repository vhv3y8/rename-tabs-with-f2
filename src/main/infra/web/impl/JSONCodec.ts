import type {
  Deserializer,
  Serializer,
} from "@main/application/ports/infra/Serializer"

export class JSONCodec implements Serializer, Deserializer {}
