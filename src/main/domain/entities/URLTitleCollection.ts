// this is exact match currently, but can be glob string later
export type URLMatch = string
export type TabTitle = string

export type URLTitleConflictItem = { match: URLMatch; title: TabTitle }
// 2 or more items. only 2 for now
export type URLTitleConfliction = URLTitleConflictItem[]
export type URLTitleResolvedConfliction = URLTitleConflictItem

export interface URLTitleCollection {
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

export class URLTitleRecord implements URLTitleCollection {
  constructor(public record: Record<URLMatch, TabTitle> = {}) {
    console.log("[initialize url title record]", record)
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
    for (const [urlMatch, title] of entries) {
      if (this.record[urlMatch] !== undefined) {
        conflictions.push([
          // existing
          {
            match: urlMatch,
            title: this.record[urlMatch],
          },
          // given entry
          {
            match: urlMatch,
            title,
          },
        ])
      }
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
