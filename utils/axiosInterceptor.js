import { getLoginUserData } from "@/Redux/Authentication/AuthenticationSlice";
import axios from "axios";
import Router from "next/router";
import store from "../src/store";



// Attach a global interceptor
axios.interceptors.response.use(
  (response) => response, // ✅ pass through success
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 && data.error === "Token expired") {
        // 🔥 Dispatch logout action
       
         store.dispatch(getLoginUserData({}));

        // Optional: show message
        alert("Session expired. Please log in again.");

        // Redirect to login page
        Router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
