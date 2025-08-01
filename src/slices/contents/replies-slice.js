import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiBase.js";

// Lấy replies của nhiều câu hỏi
export const fetchRepliesByQuestionIds = createAsyncThunk(
  "replies/get-replies-by-question-ids",
  async (questionIds) => {
    
    const res = await api.post("/replies/get-replies-by-question-ids", { questionIds });
    console.log(res.data);
    return res.data; // { questionId1: [replies], ... }
  }
);

// Lấy replies con của một reply
export const fetchRepliesByReplyIds = createAsyncThunk(
  "replies/get-replies-by-reply-ids",
  async (repliesIds) => {
    debugger
    const res = await api.post("/replies/get-replies-by-reply-ids", { repliesIds });
    console.log(res.data);
    return res.data; // { replyId: [replies] }
  }
);

// Thêm một reply mới
export const addReply = createAsyncThunk(
  "replies/add-reply",
  async ({ questionId, parentId, userId, text }) => {
    const res = await api.post("/replies/add-reply", {
      questionId,
      parentId,
      userId,
      text,
    });
    return res.data; // { parentId, reply }
  }
);

const repliesSlice = createSlice({
  name: "replies",
  initialState: {
    data: {}, // key: parentId => value: [replies]
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Get replies by multiple question IDs
      .addCase(fetchRepliesByQuestionIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepliesByQuestionIds.fulfilled, (state, action) => {
        state.loading = false;
        const repliesByQuestion = action.payload;
        for (const [questionId, replies] of Object.entries(repliesByQuestion)) {
          state.data[questionId] = replies;
        }
      })
      .addCase(fetchRepliesByQuestionIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get replies by reply ID
      .addCase(fetchRepliesByReplyIds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepliesByReplyIds.fulfilled, (state, action) => {
        state.loading = false;
        const repliesByReply = action.payload; // { replyId: [replies] }
        for (const [parentId, replies] of Object.entries(repliesByReply)) {
          state.data[parentId] = replies;
        }
      })
      .addCase(fetchRepliesByReplyIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add new reply
      .addCase(addReply.fulfilled, (state, action) => {
        const { questionId, parentId, reply } = action.payload;
        if (parentId) {
          // Nếu chưa có replies cho parentId thì khởi tạo
          if (!Array.isArray(state.data[parentId])) {
            state.data[parentId] = [];
          } 
          state.data[parentId].push(reply);
          state.data[parentId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
          // Nếu chưa có replies cho questionId thì khởi tạo
          if (!Array.isArray(state.data[questionId])) {
            state.data[questionId] = [];
          }
          state.data[questionId].push(reply);
          state.data[questionId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
      })
      
      .addCase(addReply.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default repliesSlice.reducer;
