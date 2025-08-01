import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiBase";

// Thunk
export const fetchUnfollowedUsers = createAsyncThunk(
  "users/fetchUnfollowed",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/profile/unfollowed-users`, { userId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Lỗi tải dữ liệu");
    }
  }
);

const userSuggestionsSlice = createSlice({
  name: "userSuggestions",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnfollowedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnfollowedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUnfollowedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSuggestionsSlice.reducer;
