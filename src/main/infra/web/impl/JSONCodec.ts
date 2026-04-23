import type { Serializer } from "@main/application/ports/infra/Serializer"
import { URLTitleRecord } from "@main/domain/entities/URLTitleCollection"

export class URLTitleRecordJSONCodec
  implements Serializer<URLTitleRecord, string>
{
  serialize(record: URLTitleRecord): string {
    return JSON.stringify(record.toRecord(), null, 2)
  }
  deserialize(raw: string): URLTitleRecord {
    const parsed = JSON.parse(raw)
    return new URLTitleRecord().fromRecord(parsed)
  }
}
