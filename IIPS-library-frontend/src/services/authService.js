import axiosClient from '../api/axiosClient';

export const authService = {
  // Login
  login: async (username, password) => {
    const response = await axiosClient.post('/auth/login', { username, password });
    if (response.data.success && response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    }
  },

  // Get current admin
  getMe: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await axiosClient.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axiosClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (email, code, newPassword) => {
    const response = await axiosClient.put('/auth/reset-password', {
      email,
      code,
      newPassword
    });
    return response.data;
  },

  // Check if logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  // Get stored admin data
  getAdminData: () => {
    const data = localStorage.getItem('adminData');
    return data ? JSON.parse(data) : null;
  }
};

