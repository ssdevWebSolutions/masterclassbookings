// src/Redux/venues/venuesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchVenuesApi,
  createVenueApi,
  updateVenueApi,
  deleteVenueApi,
} from "../../pages/api/venueapi/venues-api";

// Fetch all venues
export const fetchVenues = createAsyncThunk(
  "venues/fetchVenues",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchVenuesApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load venues");
    }
  }
);

// Create venue
export const createVenue = createAsyncThunk(
  "venues/createVenue",
  async (payload, { rejectWithValue }) => {
    try {
      const created = await createVenueApi(payload);
      return created;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create venue");
    }
  }
);

// Update venue
export const updateVenue = createAsyncThunk(
  "venues/updateVenue",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      console.log(id,id.payload,"payload");
      const updated = await updateVenueApi(id, id.payload);
      console.log(updated,"update");
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update venue");
    }
  }
);

//  Delete venue
export const deleteVenue = createAsyncThunk(
  "venues/deleteVenue",
  async (id, { rejectWithValue }) => {
    try {
      await deleteVenueApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete venue");
    }
  }
);

const venuesSlice = createSlice({
  name: "venues",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // for client-side local updates if needed later
    clearVenuesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load venues";
      })

      // CREATE
      .addCase(createVenue.pending, (state) => {
        state.error = null;
      })
      .addCase(createVenue.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(createVenue.rejected, (state, action) => {
        state.error = action.payload || "Failed to create venue";
      })

      // UPDATE
      .addCase(updateVenue.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated?.id) return;
        const idx = state.items.findIndex((v) => v.id === updated.id);
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(updateVenue.rejected, (state, action) => {
        state.error = action.payload || "Failed to update venue";
      })

      // DELETE
      .addCase(deleteVenue.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((v) => v.id !== id);
      })
      .addCase(deleteVenue.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete venue";
      });
  },
});

export const { clearVenuesError } = venuesSlice.actions;

export default venuesSlice.reducer;
