import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiBase.js"; // Axios instance

export const fetchTags = createAsyncThunk("tags/fetchAll", async () => {
  const res = await api.get("/tags");
  return res.data;
});

export const getTagByIds = createAsyncThunk("tags/getByIds", async (ids) => {
  const res = await api.post(`/tags/getallcurrenttags`, { ids: ids });
  return res.data;
});

export const createTag = createAsyncThunk("tags/create", async (tagData) => {
  const res = await api.post("/tags", tagData);
  return res.data;
});

export const updateTag = createAsyncThunk("tags/update", async ({ id, updates }) => {
  const res = await api.put(`/tags/${id}`, updates);
  return res.data;
});

export const deleteTag = createAsyncThunk("tags/delete", async (id) => {
  await api.delete(`/tags/${id}`);
  return id;
});

const tagsSlice = createSlice({
  name: "tags",
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(getTagByIds.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  }
});

export default tagsSlice.reducer;
