import axios from "axios";

const API_URL = 'http://localhost:3001';

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Login failed');
    }
}

export default {
    login,
};