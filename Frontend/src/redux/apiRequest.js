// import axios from 'axios';

// // Tạo một instance axios với cấu hình mặc định
// const api = axios.create({
//     baseURL: 'http://localhost:3001',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');    // lấy token từ localStorage
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;   // Gắn token vào header Authorization
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

// // hàm login
// export const loginApi = async (credentials) => {
//     try {
//         const response = await api.post('/auth/login', credentials);
//         console.log('Login response:', response.data);
//         return response.data; // Trả về dữ liệu từ response, bao gồm token
//     } catch (error) {
//         throw error.response?.data?.message || 'Login failed'; // Xử lý lỗi trả về
//     }
// };

// // hàm register
// export const registerApi = async (credentials) => {
//     try {
//         const response = await api.post('/auth/register', credentials);
//         console.log('Register response:', response.data);
//         return response.data; // Trả về dữ liệu từ response, bao gồm token
//     } catch (error) {
//         throw error.response?.data?.message || 'Registration failed'; // Xử lý lỗi trả về
//     }
// };

// // hàm logout
// export const logoutApi = () => {
//     localStorage.removeItem('token');
// }

// export default api;

import axios from "axios";
import {
    loginFailed,
    loginStart,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailed
} from "./authSlice";

const api = axios.create({
    baseURL: "http://localhost:3001",
});

// cấu hình axios interceptors để gắn Authorization vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await api.post("/auth/login", user);
        const token = res.data.body.token;
        const role = res.data.body._doc.Role;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        dispatch(loginSuccess(res.data));
        if (role === 1) {
            navigate("/admin");
        }
        else if (role === 0) {
            navigate("/");
        }
    } catch (error) {
        dispatch(loginFailed());
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post("http://localhost:3001/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
    } catch (error) {
        dispatch(registerFailed());
    }
};

// hàm gửi request quên mật khẩu
export const passwordForgot = async (Email) => {
    try {
        const response = await axios.post("http://localhost:3001/auth/password/forgot", { Email });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// hàm xác thực OTP
export const verifyOTP = async (Email, OTP) => {
    try {
        const response = await api.post("http://localhost:3001/auth/password/otp", { Email, OTP });
        console.log(response.data);
        return response.data; // Trả về kết quả xác thực OTP
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export const resetPassword = async (Email, Password) => {
    try {
        const response = await axios.post("http://localhost:3001/auth/password/reset", { Email, Password });
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}