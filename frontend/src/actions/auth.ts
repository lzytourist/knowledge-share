'use server'

import {ApiError, LoginSchemaType, LoginTokenType} from "@/lib/types";
import {baseAPI, setAccessToken, setRefreshToken} from "@/actions/index";

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