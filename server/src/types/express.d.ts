/** Lets controllers read req.user without reaching for a cast */
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export {};
