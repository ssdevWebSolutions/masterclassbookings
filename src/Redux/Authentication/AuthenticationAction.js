
import { clearBookings } from '../bookingSlice/bookingSlice';
import { setKidsList } from '../Kids/KidsSlice';
import {getLoginModalStatus, getLoginUserData} from  './AuthenticationSlice';
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
        // console.log("Server response:", result);
      } catch (error) {
        // console.error("Error:", error);
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
        // console.error("Login failed:", errorText);
        dispatch(getLoginUserData({
            error: true,          // add a flag
            errorMessage: "Invalid email or password"
        }));
        return;
      }
  
      const result = await response.json(); // <-- parse the JSON
      // console.log("Server response for login:", result);
  
      // dispatch login success here if needed
      dispatch(getLoginUserData(result));
  
    } catch (error) {
      // console.error("Error:", error);
    }
  };


  export const logOutUserWithType = () => async (dispatch) => {
    try {
      sessionStorage.removeItem('reservationId');
      sessionStorage.removeItem('reservationData');
      sessionStorage.removeItem('paymentInProgress');
      sessionStorage.removeItem('cricketBookingData');
      // dispatch login success here if needed
      dispatch(getLoginUserData({}));
      dispatch(clearBookings());
      dispatch(setKidsList());
  
    } catch (error) {
      // console.error("Error:", error);
    }
  };
  


  export const loginModalForSlice = (data) => async(dispatch)=>{
    try{
      
      dispatch(getLoginModalStatus(data));
    }
    catch(e)
    {
      // console.log("error trying login modal open"+  e);
    }
  }

  /**
   * Test Email API
   * Sends a test email to the specified email address
   */
  export const testEmail = (email) => async (dispatch) => {
    try {
      const response = await fetch(`${BASE_URL}/test-email?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Test email failed:", errorText);
        return { success: false, error: errorText };
      }

      const result = await response.json();
      console.log("Test email sent successfully:", result);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error sending test email:", error);
      return { success: false, error: error.message };
    }
  };
  