import axios from 'axios';
import { toast } from 'react-toastify';
const BASE_URL = 'http://localhost:3000/auth/api';

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { username: email, password });
        if (response.status === 200) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            toast.success('Login Successful!');
            return response.data;
        }

    } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong');
    }
};

// Signup API Call 
export const registerUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, { username: email, password });
        // ✅ Check if the response status is 200
        if (response.status === 201) {
            toast.success('Signup Successful! Please log in.');
            return response.data;
        }
    } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong');
    }
};
