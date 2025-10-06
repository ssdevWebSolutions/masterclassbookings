import { createSlice } from "@reduxjs/toolkit";

const initialAuthSlice = {
  registerStatus: false,
  loginData :{},
  loginModal:false
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
    },
    getLoginModalStatus:(state,action)=>{
      state.loginModal = action.payload
    }
  },
});

export const { getRegisterAuthStatus,getLoginUserData,getLoginModalStatus } = authSlice.actions;
export default authSlice.reducer;
