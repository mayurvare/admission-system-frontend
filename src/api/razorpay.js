import axios from 'axios';
import { toast } from 'react-toastify';
const BASE_URL = 'http://localhost:5001/order/api';

//
export const createOrder = async (amount, receiptId) => {
    try {
        const response = await axios.post(`${BASE_URL}/create-order`, {
            "amount": amount, "receiptId": receiptId
        });
        if (response.status === 200) {
            console.log(response.data.order);
            return response.data;
        }

    } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || 'Something went wrong');
    }
};