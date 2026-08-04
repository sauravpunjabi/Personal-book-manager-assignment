import { isAxiosError } from 'axios';

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string>;
}

export interface ApiError {
  message: string;
  fieldErrors: Record<string, string>;
}

const FALLBACK = 'Something went wrong. Please try again.';
const OFFLINE = 'Cannot reach the server. Check that it is running and try again.';

/**
 * Turns whatever axios threw into something a form can display. A request that
 * never got a response is worth its own message — "invalid credentials" and
 * "the API is down" should not read the same to the person typing.
 */
export function getApiError(error: unknown): ApiError {
  if (isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return { message: OFFLINE, fieldErrors: {} };
    }

    return {
      message: error.response.data?.message ?? FALLBACK,
      fieldErrors: error.response.data?.errors ?? {},
    };
  }

  return { message: FALLBACK, fieldErrors: {} };
}
