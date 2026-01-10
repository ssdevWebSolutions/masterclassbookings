/**
 * Auth Guard Hook
 * Single Responsibility: Handle authentication checks and redirects
 */

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

/**
 * Custom hook for authentication guard
 * @returns {{isAuthenticated: boolean, token: string|null, userId: number|null, userName: string}}
 */
export const useAuthGuard = () => {
  const router = useRouter();
  const loginData = useSelector((state) => state.auth.loginData);
  const token = loginData?.token;
  const userId = loginData?.id;
  const userName = loginData?.fullName || loginData?.name || "User";

  useEffect(() => {
    if (!token || token === null || token === "") {
      router.push("/");
    }
  }, [token, router]);

  return {
    isAuthenticated: !!token,
    token,
    userId,
    userName,
    loginData
  };
};

