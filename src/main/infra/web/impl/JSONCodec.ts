import type { Serializer } from "@main/application/ports/infra/Serializer"
import {
  isValidURLTitleCollectionRecord,
  SchemaValidationError,
  URLTitleRecord,
} from "@main/domain/entities/URLTitleCollection"

export class URLTitleRecordJSONCodec
  implements Serializer<URLTitleRecord, string>
{
  serialize(record: URLTitleRecord): string {
    return JSON.stringify(record.toRecord(), null, 2)
  }
  deserialize(raw: string): URLTitleRecord {
    // JSON.parse will throw SyntaxError if data is invalid
    const parsed = JSON.parse(raw)

    if (isValidURLTitleCollectionRecord(parsed)) {
      const parsedValueStringified = Object.keys(parsed).reduce(
        (parsed, key) => {
          if (typeof parsed[key] !== "string") {
            // make all values into string
            parsed[key] = String(parsed[key])
          }
          return parsed
        },
        parsed,
      )
      console.log(
        "[url title record json codec] [deserialize] [value stringified]",
        parsedValueStringified,
      )
      return new URLTitleRecord().fromRecord(parsedValueStringified)
    } else {
      throw new SchemaValidationError(
        "Schema validation failed. Top level data should be object.",
      )
    }
  }
}
