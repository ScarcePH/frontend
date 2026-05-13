import api from "./setup";
import { AxiosError, type AxiosRequestConfig } from "axios";

export type ApiError = Error & {
  status?: number;
  code?: string;
};

function createApiError(message: string, status?: number, code?: string): ApiError {
  const error = new Error(message) as ApiError;
  error.name = "ApiError";
  error.status = status;
  error.code = code;
  return error;
}

async function request(config: AxiosRequestConfig) {
  try {
    const response = await api.request(config);
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export const apiClient = {
  get(url: string, config?: AxiosRequestConfig) {
    return request({ method: "GET", url, ...config });
  },

  post(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request({ method: "POST", url, data, ...config });
  },

  put(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request({ method: "PUT", url, data, ...config });
  },

  delete(url: string, config?: AxiosRequestConfig) {
    return request({ method: "DELETE", url, ...config });
  },
};

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as any;

    return createApiError(
      data?.message || data.error || error.message || "Request failed",
      status,
      data?.code
    );
  }

  return createApiError("Unexpected error occurred");
}
