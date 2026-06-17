import API from './api';

const asArray = (data, key) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
};

// 1. Get all transactions from the backend (GET)
export const getTransactions = async () => {
  const response = await API.get('/transactions/');
  return asArray(response.data, 'transactions');
};

// 2. Create a new transaction in the backend (POST)
export const createTransaction = async (transactionData) => {
  const response = await API.post('/transactions/', transactionData);
  return response.data;
};

// user accounts fetching function (GET)
export const getUserAccounts = async () => {
  const response = await API.get('/accounts/');
  return asArray(response.data, 'accounts');
};
