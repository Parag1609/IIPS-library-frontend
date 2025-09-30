import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {uploadByCSVAsync} from "./../../features/requests/requestsSlice"
export default function UploadCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

     try {
      const resultAction = await dispatch(uploadByCSVAsync(formData));
      if (uploadByCSVAsync.fulfilled.match(resultAction)) {
        setMessage("File uploaded successfully!");
      } else {
        setMessage(resultAction.payload || "Upload failed.");
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
    }
  };

  return (
    <div className="page">
      <h1>Upload CSV</h1>
      <p>Here you can upload CSV files for membership.</p>

      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {message && <p>{message}</p>}

      <Link to="/addmembershiprequest">
        <button>⬅ Back</button>
      </Link>
    </div>
  );
}
