const REQUIRED_VARS = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN'] as const;

/**
 * Fails fast on boot if the server is misconfigured. Without this a missing
 * JWT_SECRET only surfaces when someone tries to log in, which is a much
 * worse place to find out.
 */
export function validateEnv(): void {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    console.error('Copy .env.example to .env and fill in the values.');
    process.exit(1);
  }
}
