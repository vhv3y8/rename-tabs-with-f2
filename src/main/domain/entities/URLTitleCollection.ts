// this is exact match currently, but can be glob string later
export type URLMatch = string
export type TabTitle = string

export type URLTitleConflictItem = { url: URLMatch; title: TabTitle }
// 2 or more items
export type URLTitleConfliction = URLTitleConflictItem[]
export type URLTitleResolvedConfliction = URLTitleConflictItem

export interface URLTitleCollection {
  toRecord(): Record<URLMatch, TabTitle>
  entries(): [URLMatch, TabTitle][]
  removeEntries(entries: [URLMatch, TabTitle][]): void

  tryAppendingEntries(
    entries: [URLMatch, TabTitle][],
  ): true | URLTitleConfliction[]
  continueAppending(
    resolvedConflictions: URLTitleResolvedConfliction[],
  ): boolean
}

export class URLTitleRecord implements URLTitleCollection {
  constructor(public record: Record<URLMatch, TabTitle> = {}) {}

  toRecord() {
    return this.record
  }
  entries() {
    return Object.entries(this.record)
  }
  removeEntries(entries: [URLMatch, TabTitle][]): void {
    //
  }

  tryAppendingEntries(entries: [URLMatch, TabTitle][]) {
    return true as true
  }
  continueAppending(
    resolvedConflictions: URLTitleResolvedConfliction[],
  ): boolean {
    return true
  }
  private appendEntries(entries: [URLMatch, TabTitle][]) {}
}
