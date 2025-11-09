import axios from "axios";
import store from "./store";
import { getLoginUserData } from "./Redux/Authentication/AuthenticationSlice";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // use your same BASE_URL
});

// ✅ Automatically attach token on every request
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.loginData.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Automatically refresh token if expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const state = store.getState();
      const refreshToken = state.auth.loginData.refreshToken;
    console.log("Refresh token:", refreshToken);
      try {
        const refreshRes = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`, {
          refreshToken,
        });

        const newAccessToken = refreshRes.data.accessToken;

        // Update Redux State
        store.dispatch(
          getLoginUserData({
            ...state.auth.loginData,
            token: newAccessToken, // overwrite old token
          })
        );

        // Retry original request
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(error.config);

      } catch (refreshErr) {
        console.log("Refresh token expired → force logout needed later");
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
