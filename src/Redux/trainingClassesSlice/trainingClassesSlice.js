import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTrainingClassesApi,
  createTrainingClass,
  updateTrainingSchedule,
} from "@/pages/admin/schedule/training-classes/api/trainingClassesApi";

/* =========================
   THUNKS
========================= */

/* ---- FETCH ALL ---- */
export const fetchTrainingClasses = createAsyncThunk(
  "trainingClasses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTrainingClassesApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---- CREATE ---- */
export const createTrainingClassThunk = createAsyncThunk(
  "trainingClasses/create",
  async (payload, { rejectWithValue }) => {
    try {
      await createTrainingClass(payload);
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ---- UPDATE SCHEDULE ---- */
export const updateTrainingScheduleThunk = createAsyncThunk(
  "trainingClasses/updateSchedule",
  async ({ id, weeklyPlans }, { rejectWithValue }) => {
    try {
      await updateTrainingSchedule(id, { weeklyPlans });
      return { id, weeklyPlans };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   SLICE
========================= */

const trainingClassesSlice = createSlice({
  name: "trainingClasses",

  initialState: {
    items: [],        // ✅ always array
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ---------- FETCH ---------- */
      .addCase(fetchTrainingClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainingClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTrainingClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- CREATE ---------- */
      .addCase(createTrainingClassThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTrainingClassThunk.fulfilled, (state) => {
        state.loading = false;
        // 🔁 refetch handled by UI (or call fetchTrainingClasses after)
      })
      .addCase(createTrainingClassThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- UPDATE SCHEDULE ---------- */
      .addCase(updateTrainingScheduleThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTrainingScheduleThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTrainingScheduleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trainingClassesSlice.reducer;
