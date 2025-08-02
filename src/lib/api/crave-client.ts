import axios from "axios";

const STORE_FRONT_API_BASE_URL = process.env.NEXT_PUBLIC_STORE_FRONT_API_URL || "http://localhost:8000";

// Local development mode flag
const isLocalMode = process.env.NEXT_PUBLIC_LOCAL_MODE === 'true';

// SWR fetcher function
export const fetcherSWR = async (
  endPoint: string,
  baseUrl = STORE_FRONT_API_BASE_URL,
) => {
  return handleRequestClientSide(endPoint, undefined, undefined, baseUrl).then(
    (res) => res.data,
  );
};

// Core request handler
async function handleRequestClientSide(
  endPoint: string,
  method = "GET",
  data?: Record<string, unknown>,
  baseUrl = STORE_FRONT_API_BASE_URL,
) {
  const fullEndpoint = `${baseUrl}${endPoint}`;

  // Get auth token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  return axios({
    method: method,
    url: fullEndpoint,
    ...(data && { data }),
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.NEXT_PUBLIC_CRAVEUP_API_KEY || process.env.NEXT_PUBLIC_API_KEY as string,
      ...(Boolean(token) && { Authorization: `Bearer ${token}` }),
    },
  });
}

// API request methods
export const fetchData = async (
  endPoint: string,
  baseUrl?: string,
) => {
  const response = await handleRequestClientSide(
    endPoint,
    undefined,
    undefined,
    baseUrl,
  );

  return response.data;
};

export const postData = async (
  endpoint: string,
  data: Record<string, unknown>,
  baseUrl?: string,
) => {
  // Local mode fallback
  if (isLocalMode) {
    console.log('🟡 Local mode enabled - using mock data for POST:', endpoint);
    return getMockPostResponse(endpoint, data);
  }

  try {
    console.log('POST request attempt:', {
      endpoint,
      fullUrl: `${baseUrl || STORE_FRONT_API_BASE_URL}${endpoint}`,
      data,
      apiKey: process.env.NEXT_PUBLIC_CRAVEUP_API_KEY ? 'SET' : 'NOT SET',
      baseUrl: baseUrl || STORE_FRONT_API_BASE_URL
    });

    const response = await handleRequestClientSide(
      endpoint,
      "POST",
      data,
      baseUrl,
    );

    return response.data;
  } catch (error: unknown) {
    const isAxiosError = error && typeof error === 'object' && 'response' in error;
    const errorMessage = isAxiosError && 'message' in error ? (error as { message: string }).message : 'Unknown error';
    const errorCode = isAxiosError && 'code' in error ? (error as { code: string }).code : undefined;
    
    interface AxiosErrorLike {
      response?: { data?: unknown; status?: number; statusText?: string; headers?: unknown };
      config?: { method?: string; url?: string; headers?: unknown };
    }
    
    const axiosError = isAxiosError ? error as AxiosErrorLike : null;
    
    console.error('POST request failed:', {
      endpoint,
      fullUrl: `${baseUrl || STORE_FRONT_API_BASE_URL}${endpoint}`,
      data,
      error: axiosError?.response?.data || errorMessage,
      status: axiosError?.response?.status,
      statusText: axiosError?.response?.statusText,
      headers: axiosError?.response?.headers,
      config: {
        method: axiosError?.config?.method,
        url: axiosError?.config?.url,
        headers: axiosError?.config?.headers
      }
    });

    // Fallback to local mode on connection error
    if (errorCode === 'ECONNREFUSED' || errorMessage.includes('Network Error')) {
      console.log('🟡 API unavailable - falling back to mock data for POST:', endpoint);
      return getMockPostResponse(endpoint, data);
    }
    
    throw error;
  }
};

// Mock response generator for local development
function getMockPostResponse(endpoint: string, data: Record<string, unknown>) {
  // Mock cart creation
  if (endpoint.includes('/carts') && !endpoint.includes('/cart-item')) {
    return {
      cartId: 'mock-cart-' + Date.now(),
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: 'active'
    };
  }

  // Mock add to cart
  if (endpoint.includes('/cart-item')) {
    const quantity = typeof data.quantity === 'number' ? data.quantity : 1;
    const price = 5.00;
    return {
      cartId: 'mock-cart-123',
      items: [{
        _id: 'mock-item-' + Date.now(),
        productId: data.id,
        quantity: quantity,
        price: price,
        itemTotal: quantity * price
      }],
      subtotal: quantity * price,
      tax: quantity * price * 0.08,
      total: quantity * price * 1.08
    };
  }

  // Mock promo code application
  if (endpoint.includes('/discounts/apply-discount')) {
    return {
      discountApplied: true,
      discountAmount: 2.00,
      discountCode: data.discountCode
    };
  }

  // Default mock response
  return {
    success: true,
    message: 'Mock response for local development',
    data: data
  };
}

export const putData = async (
  endpoint: string,
  data: Record<string, unknown>,
  baseUrl?: string,
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "PUT",
    data,
    baseUrl,
  );
  return response.data;
};

export const patchData = async (
  endpoint: string,
  data: Record<string, unknown>,
  baseUrl?: string,
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "PATCH",
    data,
    baseUrl,
  );
  return response.data;
};

export const deleteData = async (
  endpoint: string,
  data?: Record<string, unknown>,
  baseUrl?: string,
) => {
  const response = await handleRequestClientSide(
    endpoint,
    "DELETE",
    data,
    baseUrl,
  );
  return response.data;
};