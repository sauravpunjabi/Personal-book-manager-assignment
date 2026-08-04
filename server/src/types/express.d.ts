/**
 * The auth middleware attaches the authenticated user's id to the request.
 * Declaring it here keeps controllers free of casts when they read req.user.
 */
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export {};
