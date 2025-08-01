// slices/contents/saved-content-users-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiBase"; // Đường dẫn tới axios config

// Async thunk để gọi API
export const fetchSavedContentUsers = createAsyncThunk(
  "savedContentUsers/fetch",
  async (contentIds) => {
    const res = await api.post("/contents/fetch-saved-content-users", {
      contentIds,
    });
    return res.data;
  }
);

export const toggleSaveContent = createAsyncThunk(
  "savedContentUsers/toggle",
  async ({ contentId, userId }) => {
    const res = await api.post("/contents/save-content", { contentId, userId });
    return res.data;
  }
);

const savedContentUsersSlice = createSlice({
  name: "savedContentUsers",
  initialState: {
    usersByContentId: {},// { [contentId]: { name, avatar } }
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedContentUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedContentUsers.fulfilled, (state, action) => {
        debugger
        state.loading = false;
        const result = {};
        action.payload.forEach((item) => {
          result[item.contentId] = item.users;
        });
        state.usersByContentId = result;
      })
      .addCase(fetchSavedContentUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch saved content users";
      })
      .addCase(toggleSaveContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSaveContent.fulfilled, (state, action) => {
        state.loading = false;
        const {contentId, user, actionType} = action.payload;
        if (actionType === "save") {
          if (!state.usersByContentId[contentId]) {
            state.usersByContentId[contentId] = [];
          }
          state.usersByContentId[contentId].push({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          });
        } else {
          state.usersByContentId[contentId] = state.usersByContentId[contentId].filter((user) => user.id !== user.id);
        }
      })
      .addCase(toggleSaveContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to toggle save content";
      });
  },
});

export default savedContentUsersSlice.reducer;
