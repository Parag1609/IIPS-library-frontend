import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const UploadModal = ({
  open,
  handleClose,
  title = "Upload File",
  accept = "*/*", // allowed file types e.g. ".csv, .xlsx"
  onUpload,
  err=""       // function to call when uploading
}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("err");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      await onUpload(file); 
      handleClose();
      setFile(null);
    } catch (err) {
      setError("Upload failed. Try again.");
    }
  };

  return (
    <Modal show={open} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Select File</Form.Label>
          <Form.Control
            type="file"
            accept={accept}
            onChange={handleFileChange}
          />
        </Form.Group>
        {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={!file}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadModal;
