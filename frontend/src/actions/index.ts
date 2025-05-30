'use server'

import {cookies} from "next/headers";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "@/lib/constants";
import {jwtDecode} from "jwt-decode";
import {APIResponse} from "@/lib/types";

const BASE_API = process.env.API_URL;

interface FetchAPIOptions extends Omit<RequestInit, 'body' | 'headers'> {
  token?: string;
  body?: unknown;
  headers?: HeadersInit;
}

export const baseAPI = async <TResponse>(endpoint: string, {
  method = 'GET',
  token,
  headers,
  body,
  ...customConfig
}: FetchAPIOptions): Promise<APIResponse<TResponse>> => {
  if (!(typeof body === 'string' || body instanceof FormData)) {
    headers = {
      ...headers,
      'Content-Type': 'application/json'
    }
  }
  if (token) {
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`
    }
  }

  const config: RequestInit = {
    method,
    headers: {
      ...headers
    },
    ...customConfig
  }

  if (body) {
    config.body = body instanceof FormData
      ? body : typeof body === 'string'
        ? body : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_API}/${endpoint}`, config);
  const contentType = response.headers.get('Content-Type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  const apiResponse: APIResponse<TResponse> = {
    success: response.ok,
    status: response.status,
    statusText: response.statusText,
  };

  if (response.ok) {
    apiResponse.data = data as TResponse;
  } else {
    apiResponse.errors = data;
  }

  return apiResponse;
};

export const getAccessToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN)?.value;
}

export const getRefreshToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN)?.value;
}

export const setCookie = async (name: string, value: string, expires: Date) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    sameSite: 'strict',
    expires: expires
  });
};

export const setAccessToken = async (token: string) => {
  const {exp} = jwtDecode(token);
  await setCookie(ACCESS_TOKEN, token, new Date(exp! * 1000));
}

export const setRefreshToken = async (token: string) => {
  const {exp} = jwtDecode(token);
  await setCookie(REFRESH_TOKEN, token, new Date(exp! * 1000));
}

export const removeCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export const authenticatedPostRequest = async <TResponse>(url: string, data: string): Promise<APIResponse<TResponse>> => {
  return await baseAPI<TResponse>(url, {
    method: 'POST',
    token: await getAccessToken(),
    body: data,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}