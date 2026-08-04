const REQUIRED_VARS = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN'] as const;

/** Fails fast on boot rather than at the first login attempt */
export function validateEnv(): void {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    console.error('Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }
}
