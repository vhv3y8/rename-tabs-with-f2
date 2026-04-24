export type ToastItem = { id: number; content: string; duration: number }
export interface ToastPublisher {
  publishToast(content: string, duration?: number): number
  removeToast(toastId: number): void
  getAll(): ToastItem[]
}
