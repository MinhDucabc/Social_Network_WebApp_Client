import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../api/apiBase.js"


export const fetchFollowing = createAsyncThunk(
  'following/fetchFollowing',
  async (ids) => {
    try {
      const response = await api.post('/profile/following', { ids });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Khong the lay duoc danh sach follow");
    }

  }
);

const followingSlice = createSlice({
  name: 'following',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default followingSlice.reducer;
