import type { NextFunction, Request, Response } from 'express';

const SERVER_ERROR = 500;
const GENERIC_MESSAGE = 'Something went wrong';

function readStatusCode(error: unknown): number {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    if (typeof error.statusCode === 'number') {
      return error.statusCode;
    }
  }
  return SERVER_ERROR;
}

/** Express spots error handlers by arity, so the unused next has to stay */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statusCode = readStatusCode(error);

  console.error(error);

  // 5xx text can leak driver internals, so it never reaches the client
  const message =
    error instanceof Error && (statusCode < SERVER_ERROR || isDevelopment)
      ? error.message
      : GENERIC_MESSAGE;

  res.status(statusCode).json({
    message,
    ...(isDevelopment && error instanceof Error ? { stack: error.stack } : {}),
  });
}
