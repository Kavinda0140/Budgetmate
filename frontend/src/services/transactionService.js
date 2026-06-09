import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// 1. Get all transactions from the backend (GET)
export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/transactions/`, getAuthHeaders());
  return response.data;
};

// 2. Create a new transaction in the backend (POST)
export const createTransaction = async (transactionData) => {
  const response = await axios.post(`${API_URL}/transactions/`, transactionData, getAuthHeaders());
  return response.data;
};

// user accounts fetching function (GET)
export const getUserAccounts = async () => {
  const response = await axios.get(`${API_URL}/accounts/`, getAuthHeaders()); 
  return response.data;
};