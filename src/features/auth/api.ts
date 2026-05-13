import { apiClient } from "@/api/apiClient";

export type AuthUser = {
  id: string;
  role: "super_admin" | "user";
};

export type LoginResponse = {
  access_token: string;
  user: AuthUser;
};

export type AuthParams = {
    email:string
    password:string
}

export type ForgotPasswordParams = {
  email: string
}

export type ResetPasswordParams = {
  token: string
  password: string
}

export function checkToken() {
  return apiClient.get("/auth/validate");
}

export function loginRequest(payload: AuthParams) {
  return apiClient.post(
    "/auth/login",
    payload
  );
}

export function registerRequest(payload:AuthParams){
    return apiClient.post(
    "/auth/register",
    payload
  );
}

export function forgotPasswordRequest(payload: ForgotPasswordParams) {
  return apiClient.post("/auth/forgot-password", payload)
}

export function resetPasswordRequest(payload: ResetPasswordParams) {
  return apiClient.post("/auth/reset-password", payload)
}

export function logoutRequest(){
  return apiClient.post("/auth/logout")
}
