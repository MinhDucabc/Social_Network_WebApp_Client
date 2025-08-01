import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiBase";

// Async thunk
export const fetchRandomContents = createAsyncThunk(
  "contents/fetchRandom",
  async ({limit="10", excludeIds = [], type, searchTerm, sortValue }, thunkAPI) => {
    try {
      const res = await api.post(`/contents/random`, {
        limit,
        excludeIds,
        type, 
        searchTerm,
        sortValue
      });
      console.log(res.data.data)
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error fetching contents");
    }
  }
);

// UPDATE content
export const updateContent = createAsyncThunk(
  "contents/updateContent",
  async ({id, updateData}, thunkAPI) => {
    try {
      console.log({id, updateData})
      const res = await api.put("/contents/update-content", {id, updateData});
      return res.data.content; // trả về content đã cập nhật
    } catch (err) {
      console.log(err)
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error updating content");
    }
  }
);

// DELETE content
export const deleteContent = createAsyncThunk(
  "contents/deleteContent",
  async (contentId, thunkAPI) => {
    console.log(contentId)
    try {
      const res = await api.delete("/contents/delete-content", {data: {contentId}});
      return res.data.content; // trả về content đã xoá
    } catch (err) {
      console.log(err)
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error deleting content");
    }
  }
);

const contentsSlice = createSlice({
  name: "contents",
  initialState: {
    contents: [],
    loading: false,
    error: null,
    filters: {
      type: "all", // thêm mặc định
      searchTerm: "",
      sortValue: "newest", // thêm mặc định
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.contents = []; // reset list on new filter
    },
    clearFilters: (state) => {
      state.filters = { type: "all", searchTerm: "", sortValue: "newest" };
      state.contents = [];
    },
    updateContentVotes: (state, action) => {
      const {updatedContents} = action.payload;
      
      updatedContents.forEach((updatedItem) => {
        const index = state.contents.findIndex((item) => item.id === updatedItem.id);
        if (index !== -1) {
          state.contents[index] = updatedItem;
        }
      });
    },    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomContents.fulfilled, (state, action) => {
        state.loading = false;
        const newItems = action.payload.data.filter(
          (item) => !state.contents.some((existing) => existing.id === item.id)
        );
        state.contents.push(...newItems);
        console.log(state.contents)
      })
      .addCase(fetchRandomContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      // updateContent
      .addCase(updateContent.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.contents.findIndex((item) => item.id === updated.id);
        if (index !== -1) {
          state.contents[index] = updated;
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.error = action.payload;
      })
  
      // deleteContent
      .addCase(deleteContent.fulfilled, (state, action) => {
        const deleted = action.payload;
        state.contents = state.contents.filter((item) => item.id !== deleted.id);
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.error = action.payload;
      });
      
  },
});

export const { setFilters, clearFilters, updateContentVotes } = contentsSlice.actions;
export default contentsSlice.reducer;