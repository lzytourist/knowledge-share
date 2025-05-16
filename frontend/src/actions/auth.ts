'use server'

import {
    ApiError,
    AuthUser,
    LoginSchemaType,
    LoginTokenType,
    PasswordResetRequestType,
    PasswordResetType
} from "@/lib/types";
import {baseAPI, getAccessToken, removeCookie, setAccessToken, setRefreshToken} from "@/actions/index";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "@/lib/constants";

export const login = async (data: LoginSchemaType) => {
    try {
        const response = await baseAPI<LoginTokenType>('users/token/', {
            method: 'POST',
            body: data
        });

        await setAccessToken(response.access);
        await setRefreshToken(response.refresh);
        return true;
    } catch (e) {
        return e as ApiError;
    }
};

export const requestPasswordReset = async (data: PasswordResetRequestType) => {
    try {
        return await baseAPI<{ message: string }>('users/password-reset/send/', {
            method: 'POST',
            body: data
        });
    } catch (e) {
        return e as ApiError;
    }
};

export const resetPassword = async (data: PasswordResetType) => {
    try {
        return await baseAPI<{ message: string }>('users/password-reset/reset/', {
            method: 'POST',
            body: data
        });
    } catch (e) {
        return e as ApiError;
    }
};

export const logout = async () => {
    await removeCookie(ACCESS_TOKEN);
    await removeCookie(REFRESH_TOKEN);
};

export const getAuthUser = async () => {
    console.log('in auth user')
    try {
        return await baseAPI<AuthUser>('users/profile/', {
            method: 'GET',
            token: await getAccessToken()
        });
    } catch (e) {
        return e as ApiError;
    }
}