// this is exact match currently, but can be glob string later
export type URLMatch = string
export type TabTitle = string

export type URLTitleConflictItem = { match: URLMatch; title: TabTitle }
// 2 or more items. only 2 for now
export type URLTitleConfliction = URLTitleConflictItem[]
export type URLTitleResolvedConfliction = URLTitleConflictItem

export interface URLTitleCollection {
  // collection exists at storage as record(object)
  fromRecord(record: Record<URLMatch, TabTitle>): URLTitleCollection
  toRecord(): Record<URLMatch, TabTitle>

  entries(): [URLMatch, TabTitle][]
  removeEntries(urlMatches: URLMatch[]): void
  getTitle(urlMatch: URLMatch): TabTitle | null

  checkEntryConflictions(entries: [URLMatch, TabTitle][]): URLTitleConfliction[]
  appendEntriesWithResolvedConflictions(
    entries: [URLMatch, TabTitle][],
    resolvedConflictions: URLTitleResolvedConfliction[],
  ): void
}
export function isValidURLTitleCollectionRecord(
  data: any,
): data is Record<string, any> {
  // only check if data is object. map value with .toString() when using
  if (typeof data !== "object" || Array.isArray(data) || data === null)
    return false
  if (Object.keys(data).some((key) => typeof key !== "string")) return false
  return true
}
export class SchemaValidationError extends SyntaxError {
  constructor(message: string) {
    super(message)
    this.name = "SchemaValidationError"
  }
}

export class URLTitleRecord implements URLTitleCollection {
  public record: Record<URLMatch, TabTitle> = {}
  // use this to initialize
  fromRecord(record: Record<URLMatch, TabTitle>) {
    this.record = record
    console.log("[initialize url title record]", this.record)
    return this
  }
  toRecord() {
    return this.record
  }

  entries() {
    return Object.entries(this.record)
  }
  removeEntries(urlMatches: URLMatch[]): void {
    const allUrlMatches = Object.keys(this.record)
    for (const urlMatch of urlMatches) {
      if (allUrlMatches.includes(urlMatch)) {
        delete this.record[urlMatch]
      }
    }
  }
  getTitle(url: string) {
    // exact match
    const urlMatch = url
    return this.record[urlMatch] || null
  }

  checkEntryConflictions(entries: [URLMatch, TabTitle][]) {
    let conflictions = [] as URLTitleConfliction[]
    // check conflictions first
    for (const [urlMatch, entryTitle] of entries) {
      const existingTitle = this.record[urlMatch]
      if (existingTitle !== undefined && existingTitle !== "") {
        // same titles are not confliction
        if (entryTitle !== "" && entryTitle !== existingTitle) {
          conflictions.push([
            // existing
            {
              match: urlMatch,
              title: existingTitle,
            },
            // given entry
            {
              match: urlMatch,
              title: entryTitle,
            },
          ])
        }
      }
      // test
      // conflictions.push([
      //   // existing
      //   {
      //     match: urlMatch,
      //     title: existingTitle,
      //   },
      //   // given entry
      //   {
      //     match: urlMatch,
      //     title,
      //   },
      // ])
    }
    console.log("[check entry conflictions]", conflictions)
    return conflictions
  }
  appendEntriesWithResolvedConflictions(
    entries: [URLMatch, TabTitle][],
    resolvedConflictions: URLTitleResolvedConfliction[],
  ): void {
    for (const [urlMatch, tabTitle] of entries) {
      this.record[urlMatch] = tabTitle
    }
    for (const { match: urlMatch, title: tabTitle } of resolvedConflictions) {
      this.record[urlMatch] = tabTitle
    }
  }
}
