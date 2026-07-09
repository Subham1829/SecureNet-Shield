const LOCAL_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
];

export function getAllowedOrigins(): string[] {
  const origins = new Set<string>();

  if (process.env.NODE_ENV !== "production") {
    // Development mode: Allow localhost
    LOCAL_ORIGINS.forEach((origin) => origins.add(origin));
  }

  // Allow Vercel deployment URLs
  origins.add("https://securenet-shield-r7kcd14b4-soumipal56s-projects.vercel.app");
  origins.add("https://client-gamma-azure-13.vercel.app");
  origins.add("https://client-jtnl5rocv-soumipal56s-projects.vercel.app");

  if (process.env.CLIENT_URL) {
    origins.add(process.env.CLIENT_URL.trim());
  }

  if (process.env.ALLOWED_ORIGINS) {
    for (const origin of process.env.ALLOWED_ORIGINS.split(",")) {
      const trimmed = origin.trim();
      if (trimmed) origins.add(trimmed);
    }
  }

  return [...origins];
}
