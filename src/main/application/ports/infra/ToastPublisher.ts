export type ToastItem = { id: number; text: any; duration: number }
export interface ToastPublisher {
  publishToast(content: string): number
  removeToast(toastId: number): void
  getAll(): ToastItem[]
}
