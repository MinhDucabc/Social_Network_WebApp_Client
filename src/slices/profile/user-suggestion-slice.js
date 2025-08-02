import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiBase";

// Thunk
export const fetchUnfollowedUsers = createAsyncThunk(
  "users/fetchUnfollowed",
  async ({ userId, page = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/profile/unfollowed-users`, { userId, page });
      console.log(`📄 Fetched page ${page}, got ${res.data.length} users`);
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
    page: 1,
    hasMore: true,
  },
  reducers: {
    resetUserSuggestions: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
      state.page = 1;
      state.hasMore = true;
    },
    incrementPage: (state) => {
      state.page += 1;
      console.log(`📄 Incremented page to ${state.page}`);
    },
    removeUserFromSuggestions: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    refreshSuggestions: (state) => {
      state.users = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnfollowedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnfollowedUsers.fulfilled, (state, action) => {
        state.loading = false;
        
        // Cải thiện logic hasMore
        const receivedUsers = action.payload.length;
        const limit = 10; // Giống với server
        
        if (receivedUsers === 0) {
          state.hasMore = false;
          console.log("❌ No more users, hasMore set to false");
        } else if (receivedUsers < limit) {
          state.hasMore = false;
          console.log(`❌ Received ${receivedUsers} users (less than ${limit}), hasMore set to false`);
        } else {
          state.hasMore = true;
          console.log(`✅ Received ${receivedUsers} users, hasMore remains true`);
        }
        
        state.users.push(...action.payload);
        console.log(`📊 Total users in state: ${state.users.length}`);
      })
      .addCase(fetchUnfollowedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("❌ Fetch users failed:", action.payload);
      });
  },
});

export const { resetUserSuggestions, incrementPage, removeUserFromSuggestions, refreshSuggestions } = userSuggestionsSlice.actions;
export default userSuggestionsSlice.reducer;
