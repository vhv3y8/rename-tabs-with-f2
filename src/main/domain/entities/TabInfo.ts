export interface TabInfo {
  id: number
  // index from current window tabs
  index: number
  url: string
  title: string
  favIconUrl: string
  status: string

  connected: boolean
}
