// slices/profile/profile-slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/apiBase.js";

export const fetchUserProfile = createAsyncThunk("profile/fetchUserProfile", async (authId, thunkAPI) => {
  try {
    const res = await api.get(`/profile/${authId}`);
    console.log(res.data)
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Không thể lấy profile người dùng");
  }
});

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ userId, profileData }, thunkAPI) => {
    try {
      const res = await api.put(`/profile/update-profile/${userId}`, profileData);
      return res.data.user; // trả về thông tin user đã được cập nhật
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Cập nhật profile thất bại"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
