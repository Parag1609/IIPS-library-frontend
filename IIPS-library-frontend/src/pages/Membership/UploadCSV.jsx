import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert, Button, Table } from "react-bootstrap";
import {uploadByCSVAsync} from "./../../features/requests/requestsSlice"
import UploadModal from "../../utils/UploadModal";
import "../../styles/GlassBox.css"

export default function UploadCSV() {
  const [show,setShow] = useState(false);
  const [err,setErr] = useState("");
  const dispatch = useDispatch();

  const requiredHeaders = [
    "Enrollment_Number",
    "First_Name",
    "Surname",
    "Fathers_Name",
    "Semester",
    "Course",
    "Mobile",
    "Address",
    "Passport_Size_Photo",
    "Fee_Receipt"
  ];

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
    <div className="page ">
      <h1>Upload CSV</h1>
      <p>Here you can upload CSV files for membership.</p>

      {err && <Alert variant="danger">{err}</Alert>}

      <Button onClick={() => setShow(true)} className="mb-3">
        Upload Membership CSV
      </Button>

       <div className="glass-box">
        <h5>Required CSV Headers</h5>
        <div className="glass-tags">
          {requiredHeaders.map((header, i) => (
            <span key={i} className="glass-tag">
              {header}
            </span>
          ))}
        </div>
        <p className="mt-3 text-dark" style={{ fontSize: "14px" }}>
          ⚠ Ensure headers match exactly as shown above (case-sensitive).
        </p>
      </div>
      <UploadModal
        open={show}
        handleClose={() => setShow(false)}
        title="Upload Membership Requests CSV"
        accept=".csv"
        onUpload={handleCSVUpload}
        err={err}
      />

      <Link to="/addmembershiprequest">
        <Button variant="secondary" className="mt-3">
          ⬅ Back
        </Button>
      </Link>
    </div>
  );
}
