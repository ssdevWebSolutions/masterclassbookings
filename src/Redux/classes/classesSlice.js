import { createClassApi, deleteClassApi, fetchClassesApi, updateClassApi } from "@/pages/api/classtypesapi/classes-api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// FETCH
export const fetchClasses = createAsyncThunk(
  "classes/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchClassesApi();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load classes");
    }
  }
);

// CREATE
export const createClass = createAsyncThunk(
  "classes/createClass",
  async (payload, { rejectWithValue }) => {
    try {
      return await createClassApi(payload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to create class");
    }
  }
);

// UPDATE
export const updateClass = createAsyncThunk(
  "classes/updateClass",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateClassApi(id, payload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update class");
    }
  }
);

// DELETE
export const deleteClass = createAsyncThunk(
  "classes/deleteClass",
  async (id, { rejectWithValue }) => {
    try {
      await deleteClassApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete class");
    }
  }
);

const classesSlice = createSlice({
  name: "classes",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearClassesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createClass.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(createClass.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateClass.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated?.id) return;
        const index = state.items.findIndex((c) => c.id === updated.id);
        if (index !== -1) state.items[index] = updated;
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (c) => c.id !== action.payload
        );
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearClassesError } = classesSlice.actions;
export default classesSlice.reducer;
