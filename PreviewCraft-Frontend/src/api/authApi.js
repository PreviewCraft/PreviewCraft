import api from "../services/axios";

const BACKEND_API_AUTH_URL = import.meta.env.VITE_BACKEND_API_AUTH_URL;

export const loginUser = (data) => {
    return api.post("/api/v1/auth/login", data);
};

export const registerUser = (data) => {
    return api.post("/api/v1/auth/register", data);
};

export const logoutUser = () => {
    return api.post("/api/v1/auth/logout");
};

export const getCurrentUser = () => {
    return api.get("/api/v1/auth/userDetails");
};

export const verifyEmail = (data) => {
    return api.post("/api/v1/auth/verify-email", data);
};

export const resendVerificationOtp = (data) => {
    return api.post("/api/v1/auth/resend-verification-otp", data);
};

export const forgotPassword = (data) => {
    return api.post("/api/v1/auth/forgotPassword", data);
};

export const resetPassword = (data) => {
    return api.post(`/api/v1/auth/resetPassword`, data);
};

export const getGithubAuthUrl = () => {
    return `${BACKEND_API_AUTH_URL}/github`;
};

export const googleLogin = (idToken) => {
    return api.post("/api/v1/auth/google-login", {
        idToken,
    });
};