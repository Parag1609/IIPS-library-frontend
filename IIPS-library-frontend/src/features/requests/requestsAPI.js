import axiosClient from "../../api/axiosClient";

//Get all member requests
export const FetchRequests = async (queryString="") =>{
    try {
    const response = await axiosClient.get(`/membership-requests${queryString ? `?${queryString}` : ""}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Get member request by ID
export const FetchRequestsById = async (id) =>{
    try{
        const res = await axiosClient.get(`/membership-requests/${id}`);
        return res.data;
    }
    catch{
        console.error(`Error in fetching request with ID:${id}`,error);
        throw error;
    }
};

//Delete member request
export const DeleteRequest = async (id) =>{
    try{
        const res = await axiosClient.delete(`/membership-requests/${id}`);
        return res.data;
    }catch(error){
        console.error(`Error in deleting request with ID ${id}`,error);
        throw error;
    }
};

//Upload By CSV
export const UploadByCSV = async (CSVdata) =>{
    try{
        const res = await axiosClient.post(`/membership-requests/upload-csv`,CSVdata, {
        headers: {
          "Content-Type": "multipart/form-data", // override JSON for file
        },
      });
        console.log(res)
        return res.data;
        
    }catch(error){
        console.error(`Error in Uploading`,error);
        throw error;
    }
};

//Submit request
export const SubmitRequest = async (RequestDetails) =>{
    try{
        const res = await axiosClient.post(`/membership-requests`);
        return res.data;
    }catch(error){
        console.error(`Error in submitting request`,error);
        throw error;
    }
};

//Approve request
export const ApproveRequest = async (id) =>{
    try{
        const res = await axiosClient.post(`/membership-requests/${id}/approve`);
        return res.data;
    }catch(error){
        console.error(`Error in approving request with ID:${id}`,error);
        throw error;
    }
};

//Reject request
export const RejectRequest = async (id) =>{
    try{
        const res = await axiosClient.post(`/membership-requests/${id}/reject`);
        return res.data;
    }catch(error){
        console.error(`Error in rejecting request with ID:${id}`,error);
        throw error;
    }
};

