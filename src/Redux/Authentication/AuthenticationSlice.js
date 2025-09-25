import { createSlice } from "@reduxjs/toolkit";

const initialAuthSlice = {
  registerStatus: false,
  loginData :{}
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthSlice,
  reducers: {
    getRegisterAuthStatus: (state, action) => {
      state.registerStatus = action.payload;
    },
    getLoginUserData:(state,action)=>{
        state.loginData = action.payload
    }
  },
});

export const { getRegisterAuthStatus,getLoginUserData } = authSlice.actions;
export default authSlice.reducer;
