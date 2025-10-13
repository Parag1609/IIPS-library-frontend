import axiosClient from "../../api/axiosClient.js";

// Fetch all members (with optional filters)
export const fetchMembers = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await axiosClient.get(`/members${query ? `?${query}` : ""}`);
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

// Fetch single member by ID
export const fetchMemberById = async (id) => {
  try {
    const res = await axiosClient.get(`/members/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching member with ID ${id}:`, error);
    throw error;
  }
};

export const fetchMemberByMemberId = async (memberId) => {
  try {
    const res = await axiosClient.get(`/members/find`,{params:{memberId}});
    return res.data;
  } catch (error) {
    console.error(`Error fetching member with ID ${memberId}:`, error);
    throw error;
  }
};


// Create a new member
export const createMember = async (memberData) => {
  try {
    const res = await axiosClient.post(`/members`, memberData);
    return res.data;
  } catch (error) {
    console.error("Error creating member:", error);
    throw error;
  }
};

// Update a member
export const updateMember = async (id, updateData) => {
  try {
    const res = await axiosClient.put(`/members/${id}`, updateData);
    return res.data;
  } catch (error) {
    console.error(`Error updating member with ID ${id}:`, error);
    throw error;
  }
};

// Delete a member
export const deleteMember = async (id) => {
  try {
    const res = await axiosClient.delete(`/members/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting member with ID ${id}:`, error);
    throw error;
  }
};

//  Update member card status (active/inactive)
export const updateCardStatus = async (id, status) => {
  try {
    const res = await axiosClient.patch(`/members/${id}/status`, { cardStatus: status });
    return res.data;
  } catch (error) {
    console.error(`Error updating card status for member ID ${id}:`, error);
    throw error;
  }
};

/*//  Issue a book to a member
export const issueBook = async (memberId, bookId) => {
  try {
    const res = await axiosClient.post(`/members/${memberId}/books/${bookId}/issue`);
    return res.data;
  } catch (error) {
    console.error(`Error issuing book ID ${bookId} to member ID ${memberId}:`, error);
    throw error;
  }
};

//  Return a book from a member
export const returnBook = async (memberId, bookId) => {
  try {
    const res = await axiosClient.post(`/members/${memberId}/books/${bookId}/return`);
    return res.data;
  } catch (error) {
    console.error(`Error returning book ID ${bookId} from member ID ${memberId}:`, error);
    throw error;
  }
};
*/