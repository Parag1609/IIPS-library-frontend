import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alert, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { uploadByCSVAsync } from "./../../features/requests/requestsSlice";
import UploadModal from "../../utils/UploadModal";
import "../../styles/GlassBox.css";

export default function UploadCSV() {
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
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
    console.log("Uploading file:", file);
    
    // Clear previous errors
    setErr("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const resultAction = await dispatch(uploadByCSVAsync(formData));
      
      if (uploadByCSVAsync.fulfilled.match(resultAction)) {
        console.log("Upload successful:", resultAction.payload);
        
        // ✅ Success handling with toast
        const { inserted = 0, skipped = 0, message } = resultAction.payload;
        
        toast.success(message || "File uploaded successfully!");
        
        // Show detailed stats if available
        if (inserted !== undefined || skipped !== undefined) {
          toast.info(`✅ Inserted: ${inserted} | ⚠️ Skipped: ${skipped}`, {
            autoClose: 5000
          });
        }
        
        setShow(false); // Close modal on success
        
      } else if (uploadByCSVAsync.rejected.match(resultAction)) {
        // ✅ Handle rejected action
        const errorMessage = resultAction.payload?.message || 
                            resultAction.error?.message || 
                            "Upload failed";
        
        setErr(errorMessage);
        toast.error(errorMessage);
        
        // Show additional error details if available
        if (resultAction.payload?.error) {
          console.error("Upload error details:", resultAction.payload.error);
          toast.error("Please check console for details", { autoClose: 5000 });
        }
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      
      // ✅ Error handling with toast.error
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "An error occurred during upload";
      
      setErr(errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Upload CSV</h1>
      <p>Here you can upload CSV files for membership.</p>

      {err && (
        <Alert variant="danger" dismissible onClose={() => setErr("")}>
          {err}
        </Alert>
      )}

      <Button 
        onClick={() => setShow(true)} 
        className="mb-3"
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Uploading...
          </>
        ) : (
          "Upload Membership CSV"
        )}
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
        
        {/* Sample data format */}
        <details className="mt-3">
          <summary className="text-primary" style={{ cursor: "pointer" }}>
            📋 View Sample CSV Format
          </summary>
          <pre className="bg-light p-3 mt-2 rounded" style={{ fontSize: "12px", overflow: "auto" }}>
{`Enrollment_Number,First_Name,Surname,Fathers_Name,Semester,Course,Mobile,Address,Passport_Size_Photo,Fee_Receipt
DE2202126,Parag,Jain,Ashish Jain,7,MTECH,9111805618,Jabalpur MP 483113,https://drive.google.com/...,https://drive.google.com/...
DE2202174,Avni,Sodhiya,Ajay Kumar Sodhiya,7,MTECH,9713713001,Sagar MP,https://drive.google.com/...,https://drive.google.com/...`}
          </pre>
        </details>
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
        <Button variant="secondary" className="mt-3" disabled={loading}>
          ⬅ Back
        </Button>
      </Link>
    </div>
  );
}