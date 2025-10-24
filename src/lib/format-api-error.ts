type ApiErrorResponse = {
  data?: {
    message?: string;
    code?: string;
    data?: Record<string, unknown>;
  };
  status?: number;
};

export const formatApiError = (err: unknown) => {
  const fallback = {
    message: 'Unexpected error',
    status: 400,
    code: '',
    data: undefined as Record<string, unknown> | undefined,
  };

  if (!err || typeof err !== 'object') {
    return fallback;
  }

  const error = err as {
    message?: string;
    response?: ApiErrorResponse;
    status?: number;
    statusText?: string;
    body?: string;
  };

  if (error.response?.data?.message) {
    return {
      message: error.response.data.message,
      status: error.response.status ?? fallback.status,
      code: error.response.data.code ?? '',
      data: error.response.data.data,
    };
  }

  if (typeof error.body === 'string' && error.body.length > 0) {
    try {
      const parsed = JSON.parse(error.body) as {
        message?: string;
        code?: string;
        data?: Record<string, unknown>;
      };
      if (parsed.message) {
        return {
          message: parsed.message,
          status: error.status ?? fallback.status,
          code: parsed.code ?? '',
          data: parsed.data,
        };
      }
    } catch {
      // ignore JSON parse issues and fall through
    }
  }

  return {
    message: error.message || error.statusText || fallback.message,
    status: error.status ?? fallback.status,
    code: '',
    data: undefined,
  };
};
