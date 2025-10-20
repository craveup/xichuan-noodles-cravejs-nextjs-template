import { ApiError } from "@/lib/api/config";

export const toErrorMessage = (error: unknown): string => {
  if (!error) return "Unknown error";
  if (error instanceof ApiError) {
    return error.body || `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unexpected error";
};

