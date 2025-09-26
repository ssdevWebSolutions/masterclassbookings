import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch sessions by year
export const fetchSessionsByYear = createAsyncThunk(
  "sessions/fetchByYear",
  async (year) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${year}`);
    if (!res.ok) throw new Error("Failed to fetch sessions");
    return res.json();
  }
);

const sessionsSlice = createSlice({
  name: "sessions",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateBookedCount: (state, action) => {
      const { id, bookedCount } = action.payload;
      const session = state.data.find((s) => s.id === id);
      if (session) {
        session.bookedCount = bookedCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionsByYear.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionsByYear.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchSessionsByYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateBookedCount } = sessionsSlice.actions;
export default sessionsSlice.reducer;
