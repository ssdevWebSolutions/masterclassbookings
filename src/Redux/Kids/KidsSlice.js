// Redux/Kids/KidsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const initialState = {
  list: [],
  loading: false,
  error: null,
};

// Slice
const kidsSlice = createSlice({
  name: "kids",
  initialState,
  reducers: {
    setKidsList: (state, action) => {
      state.list = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setKidsList, setLoading, setError } = kidsSlice.actions;
export default kidsSlice.reducer;

// ------------------- ACTIONS -------------------

