// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { loginApi } from './apiRequest';
// import { registerApi } from './apiRequest';

// // Thunk để gọi API đăng nhập
// export const login = createAsyncThunk('auth/login', async (credentials) => {
//     const data = await loginApi(credentials);
//     // Lưu JWT token vào localStorage để sử dụng cho các yêu cầu sau này
//     localStorage.setItem('token', data.token);
//     return data.token;
// });

// // Thunk để gọi API đăng ký
// export const register = createAsyncThunk('auth/register', async (userData) => {
//     await registerApi(userData);
//     //localStorage.setItem('token', data.token);
// });

// const authSlice = createSlice({
//     name: 'auth',
//     initialState: {
//         token: null,
//         status: 'idle',
//         error: null,
//     },
//     reducers: {
//         logout: (state) => {
//             state.token = null;
//             localStorage.removeItem('token');   // Xóa token khi logout
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(login.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 state.status = 'succeeded';
//                 state.token = action.payload;   // lưu JWT token vào redux state
//             })
//             .addCase(login.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message;
//             });
//     },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        },
        logout: {
            isFetching: false,
            error: false
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },
        logoutStart: (state) => {
            state.logout.isFetching = true;
        },
        logoutSuccess: (state, action) => {
            state.logout.isFetching = false;
            state.logout.currentUser = null;
            state.logout.error = false;
        },
        logoutFailed: (state) => {
            state.logout.isFetching = false;
            state.logout.error = true;
        },
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed
} = authSlice.actions;

export default authSlice.reducer;

