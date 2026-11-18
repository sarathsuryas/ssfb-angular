import { HttpErrorResponse } from '@angular/common/http';

interface ApiErrorBody {
  message?: string | string[];
}

/** Pulls a user-facing message out of the backend's error response shape. */
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ApiErrorBody | null;
    const message = body?.message;

    if (typeof message === 'string' && message) {
      return message;
    }
    if (Array.isArray(message) && message.length > 0) {
      return message.join(', ');
    }
    if (error.status === 0) {
      return 'Cannot reach the server. Please try again.';
    }
  }

  return fallback;
}
