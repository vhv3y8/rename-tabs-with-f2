export interface TabInfo {
  id: number
  // index from current window tabs array
  index: number
  url: string
  favIconUrl: string
  status: string

  // title queried from platform (chrome)
  title: string
  // saved rename application value
  persistedTitle: string | null
  // titles saved right before automatic rename application
  originalTitle: string | null

  connected: boolean
}
