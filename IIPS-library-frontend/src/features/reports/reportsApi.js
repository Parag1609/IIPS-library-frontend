import axiosClient from "../../api/axiosClient";

export const getDashboardStats = async () => {
  const response = await axiosClient.get('/reports/dashboard');
  return response.data;
};

// ============================================
// BOOK REPORT APIs
export const getMostIssuedBooks = async (limit = 10) => {
  const response = await axiosClient.get('reports/books/most-issued', { params: { limit } });
  return response.data;
};

export const getBooksByStatus = async () => {
  const response = await axiosClient.get('reports/books/by-status');
  return response.data;
};

export const getLostBooksReport = async () => {
  const response = await axiosClient.get('reports/books/lost');
  return response.data;
};

export const getWriteOffBooksReport = async () => {
  const response = await axiosClient.get('reports/books/writeOff');
  return response.data;
};

// ============================================
// MEMBER REPORT APIs
// ============================================
export const getMembersByType = async () => {
  const response = await axiosClient.get('reports/members/by-type');
  return response.data;
};

export const getMembersByCourse = async () => {
  const response = await axiosClient.get('reports/members/by-course');
  return response.data;
};

export const getMembersByYear = async () => {
  const response = await axiosClient.get('reports/members/by-year');
  return response.data;
};

export const getInactiveMembersReport = async () => {
  const response = await axiosClient.get('reports/members/inactive');
  return response.data;
};

// ============================================
// TRANSACTION REPORT APIs
// ============================================
export const getDailyTransactions = async (date) => {
  const response = await axiosClient.get('reports/transactions/daily', { 
    params: { date } 
  });
  return response.data;
};

export const getWeeklyTransactions = async (startDate) => {
  const response = await axiosClient.get('reports/transactions/weekly', { 
    params: { startDate } 
  });
  return response.data;
};

export const getMonthlyTransactions = async (year, month) => {
  const response = await axiosClient.get('reports/transactions/monthly', { 
    params: { year, month } 
  });
  return response.data;
};

export const getCustomRangeTransactions = async (startDate, endDate) => {
  const response = await axiosClient.get('reports/transactions/custom', { 
    params: { startDate, endDate } 
  });
  return response.data;
};

export const getCurrentlyIssuedBooks = async () => {
  const response = await axiosClient.get('reports/transactions/currently-issued');
  return response.data;
};

export const getMemberTransactionHistory = async (memberId) => {
  const response = await axiosClient.get(`reports/transactions/member/${memberId}`);
  return response.data;
};

// ============================================
// FINANCIAL REPORT APIs
// ============================================
export const getBookValueReport = async () => {
  const response = await axiosClient.get('reports/financial/book-value');
  return response.data;
};
