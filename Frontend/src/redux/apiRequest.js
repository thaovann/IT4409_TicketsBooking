import axios from 'axios';

// Tạo một instance axios với cấu hình mặc định
const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');    // lấy token từ localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;   // Gắn token vào header Authorization
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// hàm login
export const loginApi = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        console.log('Login response:', response.data);
        return response.data; // Trả về dữ liệu từ response, bao gồm token
    } catch (error) {
        throw error.response?.data?.message || 'Login failed'; // Xử lý lỗi trả về
    }
};

// hàm logout
export const logoutApi = () => {
    localStorage.removeItem('token');
}

export default api;