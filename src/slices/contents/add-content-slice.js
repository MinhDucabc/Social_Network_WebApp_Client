import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiBase.js";

// Async action để thêm content mới
export const addNewContent = createAsyncThunk(
  "newContent/addNewContent",
  async (newContent, { rejectWithValue }) => {
  debugger;
    try {
      const response = await api.post("/contents/add-content", newContent);
      console.log("✅ Response:", response);
      return response.data;
    } catch (err) {
      console.log("❌ Error:", err);
      return rejectWithValue(err.response?.data?.message || "Đã xảy ra lỗi");

    }
  }
);

const newContentSlice = createSlice({
  name: "newContent",
  initialState: {
    newContents: [],
    newContentLoading: false,
    newContentError: null,
    filters: {
      type: "all",
      searchTerm: "",
      sortValue: "newest",
    },
  },
  reducers: {
    clearNewContent(state) {
      state.newContents = [];
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.newContents = []; // reset list
    },
    clearFilters(state) {
      state.filters = { type: "all", searchTerm: "", sortValue: "newest" };
      state.newContents = [];
    },
    updateNewContent: (state, action) => {
      const { id, updateData } = action.payload;
      const index = state.newContents.findIndex(item => item.id === id);
      if (index !== -1) {
        state.newContents[index] = {
          ...state.newContents[index],
          ...updateData,
          tags: updateData.tags || state.newContents[index].tags // Preserve existing tags if not provided
        };
      }
    },
    updateNewContentVotes: (state, action) => {
      const {updatedContents} = action.payload;
      updatedContents.forEach((updatedItem) => {
        const index = state.newContents.findIndex((item) => item.id === updatedItem.id);
        if (index !== -1) {
          state.newContents[index] = updatedItem;
        }
      });
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNewContent.pending, (state) => {
        state.newContentLoading = true;
        state.newContentError = null;
      })
      .addCase(addNewContent.fulfilled, (state, action) => {
        state.newContentLoading = false;
        state.newContents.unshift(action.payload);
      })
      .addCase(addNewContent.rejected, (state, action) => {
        state.newContentLoading = false;
        state.newContentError = action.payload || "Lỗi không xác định";
      });
  },
});


export const { clearNewContent, setFilters, clearFilters, updateNewContent, updateNewContentVotes } = newContentSlice.actions;

export default newContentSlice.reducer;
