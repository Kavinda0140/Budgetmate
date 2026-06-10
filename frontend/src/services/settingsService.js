import API from './api';

export const getProfile = async () => {
  const response = await API.get('/settings/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/settings/profile', profileData);
  return response.data;
};