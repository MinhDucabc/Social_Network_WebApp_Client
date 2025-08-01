import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiBase";

// Lấy danh sách saved contents của user
export const fetchSavedContents = createAsyncThunk(
  "userSavedContent/fetchSavedContents",
  async (contents, thunkAPI) => {
    try {
      const res = await api.post(`/profile/saved-contents`, { ids: contents });
      console.log(res.data)
      return res.data.savedContents;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching saved contents");
    }
  }
);

const userSavedContentSlice = createSlice({
  name: "userSavedContent",
  initialState: {
    savedContents: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedContents.fulfilled, (state, action) => {
        debugger
        state.loading = false;
        state.savedContents = action.payload;
      })
      .addCase(fetchSavedContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default userSavedContentSlice.reducer;
