/**
 * Thrown from anywhere in a controller and picked up by errorHandler, which
 * reads statusCode off it. Saves every guard from repeating the res/return
 * dance.
 */
export class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}
