import axios from "axios";

const api = axios.create({
    baseURl: "http://localhost:5000/api",
});

export default api;