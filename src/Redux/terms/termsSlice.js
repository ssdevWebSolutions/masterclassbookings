import { createTermApi, fetchTermByIdApi, fetchTermsApi, updateTermApi } from "@/pages/admin/schedule/term/api/terms-api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// 🔹 FETCH ALL TERMS
export const fetchTerms = createAsyncThunk(
  "terms/fetchTerms",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTermsApi();
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 CREATE TERM
export const createTerm = createAsyncThunk(
  "terms/createTerm",
  async (payload, { rejectWithValue }) => {
    try {
      return await createTermApi(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 FETCH TERM BY ID
export const fetchTermById = createAsyncThunk(
  "terms/fetchTermById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchTermByIdApi(id);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 UPDATE TERM
export const updateTerm = createAsyncThunk(
  "terms/updateTerm",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateTermApi(id, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 DELETE TERM
export const deleteTerm = createAsyncThunk(
  "terms/deleteTerm",
  async (id, { rejectWithValue }) => {
    try {
      await deleteTermApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const termsSlice = createSlice({
  name: "terms",
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedTerm(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH ALL
      .addCase(fetchTerms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTerms.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTerms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createTerm.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // FETCH BY ID
      .addCase(fetchTermById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })

      // UPDATE
      .addCase(updateTerm.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        state.selected = action.payload;
      })

      // DELETE
      .addCase(deleteTerm.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (t) => t.id !== action.payload
        );
      });
  },
});

export const { clearSelectedTerm } = termsSlice.actions;
export default termsSlice.reducer;
