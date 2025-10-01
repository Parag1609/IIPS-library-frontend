import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import {uploadByCSVAsync} from "./../../features/requests/requestsSlice"
import UploadModal from "../../utils/UploadModal";

export default function UploadCSV() {
  const [show,setShow] = useState(false);
  const [err,setErr] = useState("");
  const dispatch = useDispatch();

  const handleCSVUpload = async (file) => {

    const formData = new FormData();
    formData.append("file", file);

     try {
      const resultAction = await dispatch(uploadByCSVAsync(formData));
      if (uploadByCSVAsync.fulfilled.match(resultAction)) {
        console.log("file uploaded succesfully", resultAction)
      } else {
        setErr(resultAction.payload || "Upload failed.");
      }
    } catch (error) {
      setErr("An error occurred: " + error.message);
    }
  };

  return (
    <div className="page">
      <h1>Upload CSV</h1>
      <p>Here you can upload CSV files for membership.</p>

      <Button onClick={() => setShow(true)}>Upload Membership CSV</Button>
      <UploadModal
        open={show}
        handleClose={() => setShow(false)}
        title="Upload Membership Requests CSV"
        accept=".csv"
        onUpload={handleCSVUpload}
        err={err}
      />

      <Link to="/addmembershiprequest">
        <button>⬅ Back</button>
      </Link>
    </div>
  );
}
