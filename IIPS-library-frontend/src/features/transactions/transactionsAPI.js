import axiosClient from "../../api/axiosClient";

//Get transactions
export const FetchTransactions = async(filters = {}) =>{
    try{
        const query = new URLSearchParams(filters).toString();
        const res = await axiosClient.get(`/transactions${query? `?${query}` : ""}`);
        return res.data;
    }catch(error){
        console.error(`Error in fetching requests`,error);
        throw error;
    }
};

//Get transaction by Id
export const FetchTransactionById = async(id) =>{
     try{
        const res = await axiosClient.get(`/transactions/${id}`);
        return res.data;
    }
    catch{
        console.error(`Error in fetching request with ID:${id}`,error);
        throw error;
    }
};

//Issuing book
export const IssueBook = async(Details) =>{
    try{
        const res = await axiosClient.post(`/transactions/issue`,Details);
        return res.data;
    }catch(error){
        console.error(`Error in issuing book`,error);
        throw error;
    }
};

//Returning book
export const ReturnBook = async(id,Details) =>{
    try {
    const res = await axiosClient.put(`/transactions/${id}`, Details);
    return res.data;
  } catch (error) {
    console.error(`Error in returning book:`, error);
    throw error;
  }
};