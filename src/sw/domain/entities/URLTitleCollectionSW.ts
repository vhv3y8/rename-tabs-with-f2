import type { TitleRecord } from "@lib/models/TitleRecord"

export interface URLTitleCollectionSW {
  fromRecord(record: TitleRecord): URLTitleCollectionSW
  getMatchingTitle(url: string): string | null
}

export class URLTitleRecordSW implements URLTitleCollectionSW {
  public record: TitleRecord | null = null
  fromRecord(record: TitleRecord) {
    this.record = record
    return this
  }

  getMatchingTitle(url: string) {
    if (this.record === null) return null
    // exact match for now
    else return this.record[url] || null
  }
}
