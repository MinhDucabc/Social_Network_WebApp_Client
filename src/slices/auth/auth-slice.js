import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiBase.js';

// Đăng nhập
export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await api.post("/auth/login", credentials);
    const token = res.data.token;
    localStorage.setItem("token", token);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Đăng nhập thất bại');
  }
});

// Đăng ký
export const registerUser = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || 'Đăng ký thất bại');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Đăng nhập
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Đăng ký
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
