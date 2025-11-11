import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { UploadByCSV } from "./../../features/books/booksAPI";
import UploadModal from "../../utils/UploadModal";
import "../../styles/GlassBox.css";

export default function CatalogueUploadCSV() {
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const requiredHeaders = [
    "accession_number",
    "title",
    "author_name",
    "edition",
    "publication",
    "pages",
    "rate",
    "supplier",
    "bill_number",
  ];

  const handleCSVUpload = async (file) => {
    console.log("Uploading file:", file);
    
    // Clear previous errors
    setErr("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await UploadByCSV(formData);
      console.log("Upload result:", result);

      // Success handling
      if (result.success || result.message) {
        toast.success(result.message || "File uploaded successfully!");
        setShow(false); // Close modal on success
        
        // Show additional info if available
        if (result.inserted !== undefined) {
          toast.info(`✅ Inserted: ${result.inserted} | ⚠️ Skipped: ${result.skipped || 0}`);
        }
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      
      // Error handling
      const errorMessage = error.response?.data?.message || error.message || "An error occurred during upload";
      setErr(errorMessage);
      toast.error(errorMessage); // Changed from toast.success to toast.error
      
      // Show more details if available
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`, { autoClose: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Upload CSV</h1>

      {err && <Alert variant="danger" dismissible onClose={() => setErr("")}>{err}</Alert>}

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
          <pre className="bg-light p-3 mt-2 rounded" style={{ fontSize: "12px" }}>
{`accession_number,title,author_name,edition,publication,pages,rate,supplier,bill_number
ACC001,Introduction to Algorithms,Thomas H. Cormen,3rd,MIT Press,1312,3500,ABC Books,BILL001
ACC002,Clean Code,Robert C. Martin,1st,Prentice Hall,464,2800,XYZ Publishers,BILL002`}
          </pre>
        </details>
        <div class="d-flex justify-content-center align-items-center">
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
          "Upload Books CSV"
        )}
      </Button>
      </div>
      </div>

      <UploadModal
        open={show}
        handleClose={() => setShow(false)}
        title="Upload Books CSV"
        accept=".csv"
        onUpload={handleCSVUpload}
        err={err}
      />
    </div>
  );
}