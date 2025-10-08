import React, { useEffect, useState } from "react";
import { Table, Form, Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FetchRequests,
  ApproveRequest,
  RejectRequest,
} from "../../features/requests/requestsAPI";
import ShortLink from "../../utils/ShortLink";

const MembershipRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    course: "all",
    semester: "all",
    search: ""
  });

  // Get status badge style
  const getStatusStyle = (status) => {
    const styles = {
      pending: {
        backgroundColor: "#ffc107",
        color: "#000",
        fontWeight: "500"
      },
      approved: {
        backgroundColor: "#28a745",
        color: "#fff",
        fontWeight: "500"
      },
      rejected: {
        backgroundColor: "#dc3545",
        color: "#fff",
        fontWeight: "500"
      }
    };
    return styles[status] || {};
  };

  // Fetch membership requests with filters
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Build query params from filters
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== "all") {
        queryParams.append("status", filters.status);
      }
      if (filters.course && filters.course !== "all") {
        queryParams.append("course", filters.course);
      }
      if (filters.semester && filters.semester !== "all") {
        queryParams.append("semester", filters.semester);
      }
      if (filters.search && filters.search.trim()) {
        queryParams.append("search", filters.search.trim());
      }

      const data = await FetchRequests(queryParams.toString());
      setRequests(data.data);
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === "approved") {
        await ApproveRequest(id);
        toast.success("Request approved successfully!");
      } else if (newStatus === "rejected") {
        await RejectRequest(id);
        toast.info("Request rejected");
      }
      
      // Update local state
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, Status: newStatus } : req
        )
      );
    } catch (err) {
      toast.error(err.message || "Failed to update request");
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    loadRequests();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      course: "all",
      semester: "all",
      search: ""
    });
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Auto-apply filters when they change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadRequests();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="container mt-4">
      <h2>Membership Requests</h2>

      {/* Filters Section */}
      <div className="bg-light p-3 rounded mb-4">
        <h5 className="mb-3">Filters</h5>
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Course</Form.Label>
              <Form.Select
                value={filters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
              >
                <option value="all">All Courses</option>
                <option value="BTECH">BTECH</option>
                <option value="MTECH">MTECH</option>
                <option value="MCA">MCA</option>
                <option value="MBA">MBA</option>
                <option value="MSC">MSC</option>
                <option value="PHD">PHD</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Semester</Form.Label>
              <Form.Select
                value={filters.semester}
                onChange={(e) => handleFilterChange("semester", e.target.value)}
              >
                <option value="all">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name or Enrollment..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-3 d-flex gap-2">
          <Button variant="primary" size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
          <div className="ms-auto">
            <small className="text-muted">
              Showing {requests.length} request(s)
            </small>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" />
          <p className="mt-2">Loading requests...</p>
        </div>
      )}
      
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Table */}
      {!loading && !error && (
        <>
          {requests.length === 0 ? (
            <Alert variant="info">
              No membership requests found. Try adjusting your filters.
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Enrollment No.</th>
                  <th>Name</th>
                  <th>Father's Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Mobile No.</th>
                  <th>Fee Receipt</th>
                  <th>Photo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.Enrollment_Number}</td>
                    <td>{req.First_Name + " " + req.Surname}</td>
                    <td>{req.Fathers_Name}</td>
                    <td>{req.Course}</td>
                    <td>{req.Semester}</td>
                    <td>{req.Mobile}</td>
                    <td><ShortLink url={req.Fee_Receipt} /></td>
                    <td><ShortLink url={req.Passport_Size_Photo} /></td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={req.Status}
                        onChange={(e) =>
                          handleStatusChange(req._id, e.target.value)
                        }
                        style={getStatusStyle(req.Status)}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
};

export default MembershipRequestsTable;