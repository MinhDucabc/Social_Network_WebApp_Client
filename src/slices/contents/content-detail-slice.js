// slices/content/contentById-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiBase";

// Async thunk to fetch content by ID
export const fetchContentById = createAsyncThunk(
  "contentById/fetchContentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contents/get-content-by-id/${id}`);
      return response.data.content; // because aggregation returns array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetch failed");
    }
  }
);

const contentByIdSlice = createSlice({
    name: "contentById",
    initialState: {
      content: null,
      loading: false,
      error: null,
    },
    reducers: {
      clearContent: (state) => {
        state.content = null;
        state.error = null;
        state.loading = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchContentById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchContentById.fulfilled, (state, action) => {
          state.loading = false;
          state.content = action.payload;
        })
        .addCase(fetchContentById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { clearContent } = contentByIdSlice.actions;
  export default contentByIdSlice.reducer;
  