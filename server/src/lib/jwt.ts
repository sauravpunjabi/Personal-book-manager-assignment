import jwt from 'jsonwebtoken';

const TOKEN_TTL = '7d';

export interface TokenPayload {
  id: string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }

  return secret;
}

export function signToken(userId: string): string {
  return jwt.sign({ id: userId }, getSecret(), { expiresIn: TOKEN_TTL });
}

/** Throws on a bad or expired token and lets the middleware answer with a 401 */
export function verifyToken(token: string): TokenPayload {
  const payload = jwt.verify(token, getSecret());

  if (typeof payload === 'string' || typeof payload.id !== 'string') {
    throw new Error('Token payload is malformed');
  }

  return { id: payload.id };
}
