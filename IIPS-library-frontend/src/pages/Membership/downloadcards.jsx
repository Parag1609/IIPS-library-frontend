import { useState } from "react";
import { Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DownloadBarcodes } from "../../features/books/booksAPI";

export default function DownloadCards() {
  const [memberId, setFromMemberId] = useState("");
  const [search, setSearch] = useState("");
  const [enrollment_number, setEnrollmentNumber] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => { 
  };

  const clearFilters = () => {
  };

  return (
    <div className="page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Download Barcodes</h1>
        <Link to="/catalogue">
          <Button variant="secondary">⬅ Back</Button>
        </Link>
      </div>

      <p className="text-muted mb-4">
        Download barcodes for books in PDF format. Use filters to specify which books to include.
      </p>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <div className="library-card bg-light p-4 rounded shadow-sm">
        <h5 className="mb-4">Filter Options</h5>
        
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>From Accession Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., ACC001"
                  value={fromAccNo}
                  onChange={(e) => setFromAccNo(e.target.value.toUpperCase())}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Starting accession number (inclusive)
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>To Accession Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., ACC999"
                  value={toAccNo}
                  onChange={(e) => setToAccNo(e.target.value.toUpperCase())}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Ending accession number (inclusive)
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Author Name (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by author name..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Filter by author name (case-insensitive)
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              onClick={handleDownload}
              disabled={loading || (!fromAccNo && !toAccNo && !authorName)}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Generating PDF...
                </>
              ) : (
                "Download Barcodes"
              )}
            </Button>

            <Button 
              variant="outline-secondary" 
              onClick={clearFilters}
              disabled={loading}
            >
              Clear Filters
            </Button>
          </div>
        </Form>

        {/* Info Box */}
        <div className="mt-4 p-3 bg-info bg-opacity-10 rounded">
          <h6 className="text-info mb-2">ℹ️ Information</h6>
          <ul className="mb-0 small">
            <li>PDF will contain barcodes in a 4×10 grid layout (40 per page)</li>
            <li>Leave "To" field empty to download from starting number onwards</li>
            <li>Leave "From" field empty to download up to ending number</li>
            <li>Use author filter to download barcodes for specific author's books</li>
          </ul>
        </div>
      </div>
    </div>
  );
}