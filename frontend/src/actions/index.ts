'use server'

import {cookies} from "next/headers";

const BASE_API = process.env.API_URL;
const ACCESS_TOKEN = 'access';
const REFRESH_TOKEN = 'refresh';

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
}: FetchAPIOptions): Promise<TResponse> => {
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

    if (!response.ok) {
        throw {
            status: response.status,
            data: data
        };
    }

    return data as TResponse;
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
    await setCookie(REFRESH_TOKEN, token);
}