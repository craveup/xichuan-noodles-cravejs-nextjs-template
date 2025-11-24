import { ApiError } from "@/lib/api/config";

export const toErrorMessage = (error: unknown): string => {
  if (!error) return "Unknown error";
  if (error instanceof ApiError) {
    if (error.body) {
      try {
        const parsed = JSON.parse(error.body);
        if (typeof parsed?.message === "string" && parsed.message.trim()) {
          return parsed.message;
        }
      } catch {
        // body is not JSON – fall through to string output
      }
      return error.body;
    }
    return `${error.status} ${error.statusText}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unexpected error";
};

