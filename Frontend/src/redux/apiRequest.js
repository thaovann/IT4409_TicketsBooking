import axios from "axios";
import {
    loginFailed,
    loginStart,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailed
} from "./authSlice";

import {
    createEventStart,
    createEventSuccess,
    createEventFailed,
} from "./eventSlice";

// Create an instance with default config
const api = axios.create({
    // baseURL: "http://localhost:3001",
    baseURL: "https://it4409-ticketsbooking-1.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

// Axios interceptors to attach the Authorization header if token exists
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
        //const res = await api.post("/auth/login", user);
        // const res = await axios.post("http://localhost:3001/auth/login", user)
        const res = await axios.post("https://it4409-ticketsbooking-1.onrender.com/auth/login", user)
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
        return res.data;
    } catch (error) {
        dispatch(loginFailed());
        return { error: true, message: error.response?.data?.message || "Đăng nhập thất bại" };
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        //const response = await api.post("/auth/register", user);
        // const response = await axios.post("http://localhost:3001/auth/register", user);
        const response = await axios.post("https://it4409-ticketsbooking-1.onrender.com/auth/register", user);
        dispatch(registerSuccess());
        navigate("/login");
        return response.data;
    } catch (error) {
        dispatch(registerFailed());
        return { error: true, message: error.response?.data?.message || "Đăng ký thất bại" };
    }
};

// hàm gửi request quên mật khẩu
export const passwordForgot = async (Email) => {
    try {
        // const response = await axios.post("http://localhost:3001/auth/password/forgot", { Email });
        const response = await axios.post("https://it4409-ticketsbooking-1.onrender.com/auth/password/forgot", { Email });
        return response.data;
    } catch (error) {
        return { error: true, message: error.response?.data?.message || "forgot password failed" };
    }
}

// hàm xác thực OTP
export const verifyOTP = async (Email, OTP) => {
    try {
        // const response = await axios.post("http://localhost:3001/auth/password/otp", { Email, OTP });
        const response = await axios.post("https://it4409-ticketsbooking-1.onrender.com/auth/password/otp", { Email, OTP });
        return response.data; // Trả về kết quả xác thực OTP
    } catch (error) {
        return { error: true, message: error.response?.data?.message || "verify otp failed" };
    }
};

export const resetPassword = async (Email, Password) => {
    try {
        // const response = await axios.post("http://localhost:3001/auth/password/reset", { Email, Password });
        const response = await axios.post("https://it4409-ticketsbooking-1.onrender.com/auth/password/reset", { Email, Password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
}

// Các hàm user
export const getAllUsers = async () => {
    try {
        const response = await api.get("/user");
        console.log(response.data);
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

export const updateUser = async (UserId, updatedData) => {
    try {
        const response = await api.patch(`/user/id/${UserId}`, updatedData);
        return response.data;
    } catch (error) {
        return { error: true, message: error.response?.data?.message || "update user failed" };
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

export const getEventByUserId = async (userId) => {
    try {
        const response = await api.get(`/api/event/getEventByUserId/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
};

export const updateEvent = async (eventId, updatedData) => {
    try {
        const response = await api.put(`/api/event/update/${eventId}`, updatedData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Failed to update event');
    }
}

export const deleteEvent = async (eventId) => {
    try {
        const response = await api.delete(`/api/event/delete/${eventId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Failed to delete event');
    }
}

// hàm tạo sự kiện
export const createEvent = async (eventData, dispatch) => {
    dispatch(createEventStart());
    try {
        // Adjust headers if sending FormData
        const headers =
            eventData instanceof FormData
                ? { "Content-Type": "multipart/form-data" }
                : {};

        // Post the event data to the API
        const response = await api.post("/api/event/create", eventData, {
            headers,
        });
        dispatch(createEventSuccess(response.data));
    } catch (error) {
        console.error("Error creating event:", error);

        // Log detailed error if available
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        }

        if (eventData instanceof FormData) {
            const data = Object.fromEntries(eventData.entries());
            console.log("FormData contents:", data);
        } else {
            console.log("Event Data:", eventData);
        }

        dispatch(
            createEventFailed(
                error.message || "An error occurred while creating the event."
            )
        );
    }
};

// các hàm order
export const getAllOrders = async () => {
    try {
        const response = await api.get(`/order`);
        return response.data;
    } catch (error) {
        console.error("Error get all orders:", error);
        throw error;
    }
};

export const getUserOrders = async (userId) => {
    try {
        const response = await api.get(`/order/users/${userId}?state=successed`);
        return response.data;
    } catch (error) {
        console.error("Error get user orders:", error);
        throw error;
    }
};

export const deleteOrders = async (orderId) => {
    try {
        const response = await api.delete(`/order/id/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error delete orders:", error);
        throw error;
    }
};