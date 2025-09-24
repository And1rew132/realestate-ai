export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  ms = 200
): T {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }) as T
}