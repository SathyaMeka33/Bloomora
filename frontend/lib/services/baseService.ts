import { ApiResponse } from '../types';

export class ServiceError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = 'ServiceError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse<T = unknown>(error: string): ApiResponse<T> {
  return {
    success: false,
    error,
  };
}

export async function handleServiceCall<T>(
  action: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const result = await action();
    return successResponse(result);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected server error occurred';
    console.error('Service call execution error:', err);
    return errorResponse<T>(errorMessage);
  }
}
