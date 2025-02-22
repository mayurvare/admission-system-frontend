import axios from 'axios';
import { toast } from 'react-toastify';
const BASE_URL = 'http://localhost:5001/admission/api';

// Signin API Call 
export const submitForm = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/formSubmission`, { "formData": formData });
        if (response.status === 201) {
            toast.success("Form submitted successfully. You will receive an email with the fees receipt.");
            return response.data;
        }

    } catch (err) {
        toast.error(err.response?.data?.message || 'Something went wrong');
    }
};