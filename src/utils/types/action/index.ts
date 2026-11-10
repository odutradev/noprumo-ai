export interface ActionToastMessages {
  pending: string
  success: string
  error: string
}

export interface UseActionOptions<T> {
  action: () => Promise<T>
  toastMessages: ActionToastMessages
  callback?: (result: T) => void
}
