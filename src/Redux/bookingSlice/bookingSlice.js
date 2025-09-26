// store/bookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch bookings for a user/admin
export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async ({ token, role, parentId }) => {
    let url = role === 'ADMIN'
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/bookings/all`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/bookings/parent/${parentId}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Failed to fetch bookings');
    return await res.json();
  }
);

const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    saveBooking: (state, action) => {
      state.bookings.push(action.payload); // add a new booking
    },
    setBookings: (state, action) => {
      state.bookings = action.payload; // overwrite all bookings
    },
    clearBookings: (state) => {
      state.bookings = []; // clear state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { saveBooking, setBookings, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
