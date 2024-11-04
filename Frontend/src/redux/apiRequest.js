import axios from "axios";
import {
    loginFailed,
    loginStart,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailed,
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
        const response = await axios.post("http://localhost:3001/auth/password/otp", { Email, OTP });
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

// Các hàm user
export const getAllUsers = async () => {
    try {
        const response = await api.get("/user");
        return response;
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
}

export const getUserById = async (UserId) => {
    try {
        const response = await api.get(`/user/id/${UserId}`);
        return response;
    } catch (error) {
        console.error("Failed to fetch user by id:", error);
    }
};

export const deleteUserById = async (UserId) => {
    try {
        const response = await api.delete(`/user/id/${UserId}`);
        return response;
    } catch (error) {
        console.error("Failed to delete user:", error);
    }
};

// Các hàm event
export const getAllEvents = async () => {
    try {
        const response = await api.get("/api/event/allEvents");
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};