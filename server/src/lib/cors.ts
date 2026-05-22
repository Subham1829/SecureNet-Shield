const LOCAL_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
]

export function getAllowedOrigins(): string[] {
  const origins = new Set<string>(LOCAL_ORIGINS)

  if (process.env.CLIENT_URL) {
    origins.add(process.env.CLIENT_URL.trim())
  }

  if (process.env.ALLOWED_ORIGINS) {
    for (const origin of process.env.ALLOWED_ORIGINS.split(",")) {
      const trimmed = origin.trim()
      if (trimmed) origins.add(trimmed)
    }
  }

  return [...origins]
}
