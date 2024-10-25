import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi } from './apiRequest';

// Thunk để gọi API đăng nhập
export const login = createAsyncThunk('auth/login', async (credentials) => {
    const data = await loginApi(credentials);
    // Lưu JWT token vào localStorage để sử dụng cho các yêu cầu sau này
    localStorage.setItem('token', data.token);
    return data.token;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            localStorage.removeItem('token');   // Xóa token khi logout
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;   // lưu JWT token vào redux state
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;