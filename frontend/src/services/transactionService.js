import API from './api';

// 1. Get all transactions from the backend (GET)
export const getTransactions = async () => {
  const response = await API.get('/transactions/');
  return response.data;
};

// 2. Create a new transaction in the backend (POST)
export const createTransaction = async (transactionData) => {
  const response = await API.post('/transactions/', transactionData);
  return response.data;
};

// user accounts fetching function (GET)
export const getUserAccounts = async () => {
  const response = await API.get('/accounts/'); 
  return response.data;
};
