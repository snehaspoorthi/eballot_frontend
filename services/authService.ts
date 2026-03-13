import { apiClient } from './apiClient';

export const authService = {
  register: (data: any) => apiClient('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => apiClient('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  verifyOtp: (data: any) => apiClient('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiClient('/auth/logout', { method: 'POST' }),
};
