// features/content/contentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiBase.js"

export const fetchUserContents = createAsyncThunk(
  "content/fetchUserContents",
  async (contents, { rejectWithValue }) => {
    try {
      const response = await api.post("/profile/contents", { ids: contents });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const userContentSlice = createSlice({
  name: "userContent",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserContents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUserContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi tải nội dung";
      });
  },
});

export default userContentSlice.reducer;
