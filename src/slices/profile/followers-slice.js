import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../api/apiBase.js"


export const fetchFollowers = createAsyncThunk(
  'followers/fetchFollowers',
  async (ids) => {
    try {
      const response = await api.post('/profile/followers', { ids });
      return response.data;
    }
    catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Khong the lay duoc danh sach followers");
    }
  }
);

const followersSlice = createSlice({
  name: 'followers',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default followersSlice.reducer;
