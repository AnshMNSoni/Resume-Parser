// Centralized env var access with runtime validation.
// Works identically on localhost (.env) and Vercel (env settings).

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Set it in .env (local) or Vercel Environment Variables (production).`
    );
  }
  return value;
}

function getOptionalEnv(key: string, fallback: string = ''): string {
  return process.env[key] || fallback;
}

export const env = {
  get DATABASE_URL() {
    return getRequiredEnv('DATABASE_URL');
  },
  get GEMINI_API_KEY() {
    return getOptionalEnv('GEMINI_API_KEY');
  },
  get NODE_ENV() {
    return getOptionalEnv('NODE_ENV', 'development');
  },
  get isProduction() {
    return this.NODE_ENV === 'production';
  },
} as const;
