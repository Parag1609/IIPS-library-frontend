import axiosClient from "../../api/axiosClient";

//fetch all books
export const fetchBooks = async (filters = {}) => {
    try{
        const query = new URLSearchParams(filters).toString();
        const res = await axiosClient.get(`/books${query ? `?${query}` : ""}`);
        return res.data;
        }catch(error){
            console.error("Error in fetching books:",error);
            throw error;
        }
};

//fetch book by ID
export const fetchBookById = async (id) =>{
    try{
        const res = await axiosClient.get(`/books/${id}`);
        return res.data;
    }catch(error){
        console.error(`Error in fetching book with ID ${id}:`,error);
        throw error;
    }
};

//update book details
export const UpdateBookDetails = async (id,updatedetails) =>{
    try{
        const res = await axiosClient.put(`/books/${id}`,updatedetails);
        return res.data;
    }catch(error){
        console.error(`Error in updating book with ID ${id}`,error);
        throw error;
    }
};

//Delete book
export const DeleteBook = async (id) =>{
    try{
        const res = await axiosClient.delete(`/books/${id}`);
        return res.data;
    }catch(error){
        console.error(`Error in deleting book with ID ${id}`,error);
        throw error;
    }
};

//Add book
export const AddBook = async (bookData) =>{
    try{
        const res = await axiosClient.post(`/books`,bookData);
        return res.data;
    }catch(error){
        console.error(`Error in adding book`,error);
        throw error;
    }
};

//Upload By CSV
export const UploadByCSV = async (CSVdata) =>{
    try{
        const res = await axiosClient.post(`/books/upload-csv`,CSVdata);
        return res.data;
    }catch(error){
        console.error(`Error in Uploading`,error);
        throw error;
    }
};