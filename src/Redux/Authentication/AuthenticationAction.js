
import {getLoginUserData} from  './AuthenticationSlice';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const registerUserWithType=(registerFormData)=>async(dispatch)=>{

    try {
        const response = await fetch(`${BASE_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // important for JSON
          },
          body: JSON.stringify(registerFormData),
        });
    
        const result =  response;
        console.log("Server response:", result);
      } catch (error) {
        console.error("Error:", error);
      }
}


export const loginUserWithType = (loginData) => async (dispatch) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // important for JSON
        },
        body: JSON.stringify(loginData),
      });
  
      if (!response.ok) {
        const errorText = await response;
        console.error("Login failed:", errorText);
        dispatch(getLoginUserData({
            error: true,          // add a flag
            errorMessage: "Invalid email or password"
        }));
        return;
      }
  
      const result = await response.json(); // <-- parse the JSON
      console.log("Server response for login:", result);
  
      // dispatch login success here if needed
      dispatch(getLoginUserData(result));
  
    } catch (error) {
      console.error("Error:", error);
    }
  };


  export const logOutUserWithType = () => async (dispatch) => {
    try {
      // dispatch login success here if needed
      dispatch(getLoginUserData({}));
  
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  