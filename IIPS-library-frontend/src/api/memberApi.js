import api from "./axios";

// Fetch all members
export const fetchMembers = () => api.get("/members");

// Fetch member by ID
export const fetchMemberById = (id) => api.get(`/members/${id}`);

// Add new member
export const addMember = (data) => api.post("/members", data);

// Update member
export const updateMember = (id, data) => api.put(`/members/${id}`, data);

// Delete member
export const deleteMember = (id) => api.delete(`/members/${id}`);

// Issue a book
export const issueBook = (memberId, bookId) =>
  api.post(`/members/${memberId}/books/${bookId}/issue`);

// Return a book
export const returnBook = (memberId, bookId) =>
  api.post(`/members/${memberId}/books/${bookId}/return`);