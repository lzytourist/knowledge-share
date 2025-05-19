'use server'

import {
  AuthUser,
  LoginSchemaType,
  LoginTokenType,
  PasswordResetRequestType,
  PasswordResetType,
  ProfileImageSchemaType
} from "@/lib/types";
import {baseAPI, getAccessToken, removeCookie, setAccessToken, setRefreshToken} from "@/actions/index";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "@/lib/constants";

export const login = async (data: LoginSchemaType) => {
  const response = await baseAPI<LoginTokenType>('users/token/', {
    method: 'POST',
    body: data
  });

  if (response.success) {
    await setAccessToken(response.data!.access);
    await setRefreshToken(response.data!.refresh);
  }
  return response;
};

export const requestPasswordReset = async (data: PasswordResetRequestType) => {
  return await baseAPI<{ message: string }>('users/password-reset/send/', {
    method: 'POST',
    body: data
  });
};

export const resetPassword = async (data: PasswordResetType) => {
  return await baseAPI<{ message: string }>('users/password-reset/reset/', {
    method: 'POST',
    body: data
  });
};

export const logout = async () => {
  await removeCookie(ACCESS_TOKEN);
  await removeCookie(REFRESH_TOKEN);
};

export const getAuthUser = async () => {
  return await baseAPI<AuthUser>('users/profile/', {
    method: 'GET',
    token: await getAccessToken()
  });
}

export const uploadProfileImage = async (data: ProfileImageSchemaType) => {
  const formData = new FormData();
  formData.append('image', data.image);

  return await baseAPI<{ message: string }>('users/profile-image/', {
    method: 'POST',
    body: formData,
    token: await getAccessToken()
  });
}