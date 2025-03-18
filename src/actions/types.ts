
export type ActionResponse<T> = {
  data: T | null
  success: boolean
  error?: string
}
