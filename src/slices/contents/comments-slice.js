import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiBase";

export const fetchCommentsByPostIds = createAsyncThunk(
  "comments/get-comments-by-post-ids",
  async (postIds) => {
    const res = await api.post("/comments/get-comments-by-post-ids", { postIds });
    return res.data; // { postId1: [...], postId2: [...] }
  }
);
// Thunk thêm comment mới
export const addComment = createAsyncThunk(
    "comments/add-comment",
    async ({ postId, userId, text }, thunkAPI) => {
      const res = await api.post("/comments/add-comment", { postId, userId, text });
      return res.data; // Trả về comment mới đã được populate user
    }
  );
  
const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    data: {}, // key: postId, value: [comments]
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPostIds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsByPostIds.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(fetchCommentsByPostIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.data[postId]) state.data[postId] = [];
        state.data[postId].push(comment);
        state.data[postId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default commentsSlice.reducer;
