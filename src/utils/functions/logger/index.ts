type LogLevel = "info" | "warn" | "error"

const write = (level: LogLevel, scope: string, data: unknown[]) => {
  if (!import.meta.env.DEV) return
  console[level](`[${scope}]`, ...data)
}

export const createLocalLogger = (scope: string) => ({
  info: (...data: unknown[]) => write("info", scope, data),
  warn: (...data: unknown[]) => write("warn", scope, data),
  error: (...data: unknown[]) => write("error", scope, data)
})
