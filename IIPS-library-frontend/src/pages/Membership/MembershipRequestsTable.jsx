

import React, { useEffect, useState } from "react";
import { Table, Form, Spinner, Alert, Row, Col, Button, Badge, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaEye, FaTrash, FaEdit } from "react-icons/fa";
import {
  FetchRequests,
  ApproveRequest,
  RejectRequest,
  DeleteRequest
} from "../../features/requests/requestsAPI";
import ShortLink from "../../utils/ShortLink";

const MembershipRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Filter states - updated to match new schema
  const [filters, setFilters] = useState({
    status: "all",
    course: "all",
    year: "all",
    search: ""
  });

  // Get status badge component
  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "danger"
    };
    return (
      <Badge bg={variants[status] || "secondary"} className="text-capitalize">
        {status}
      </Badge>
    );
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
      if (filters.year && filters.year !== "all") {
        queryParams.append("year", filters.year);
      }
      if (filters.search && filters.search.trim()) {
        queryParams.append("search", filters.search.trim());
      }

      const data = await FetchRequests(queryParams.toString());
      setRequests(data.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // Handle approve
  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this request?")) {
      return;
    }

    try {
      await ApproveRequest(id);
      toast.success("Request approved successfully!");
      loadRequests(); // Reload data
    } catch (err) {
      toast.error(err.message || "Failed to approve request");
    }
  };

  // Handle reject
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this request?")) {
      return;
    }

    try {
      await RejectRequest(id);
      toast.info("Request rejected");
      loadRequests(); // Reload data
    } catch (err) {
      toast.error(err.message || "Failed to reject request");
    }
  };

  // Handle delete
  const handleDelete = async (id, request) => {
    if (request.status === "approved") {
      toast.error("Cannot delete approved request");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      await DeleteRequest(id);
      toast.success("Request deleted successfully");
      loadRequests(); // Reload data
    } catch (err) {
      toast.error(err.message || "Failed to delete request");
    }
  };

  // Show details modal
  const showDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      course: "all",
      year: "all",
      search: ""
    });
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Auto-apply filters when they change (with debounce for search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadRequests();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear + 1; i >= 2000; i--) {
    yearOptions.push(i);
  }

  return (
    <div>
      <h1 className="title" >Membership Requests</h1>

      {/* Filters Section */}
      <div className="tableBox">
      <div className="bg-light p-3 rounded mb-4 shadow-sm">
        <h5 className="mb-3">
          <i className="bi bi-funnel me-2"></i>Filters
        </h5>
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">Status</Form.Label>
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
              <Form.Label className="fw-semibold">Course</Form.Label>
              <Form.Select
                value={filters.course}
                onChange={(e) => handleFilterChange("course", e.target.value)}
              >
                <option value="all">All Courses</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electronics">Electronics</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">Year of Joining</Form.Label>
              <Form.Select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
              >
                <option value="all">All Years</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name, Number, Father..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
              <Form.Text className="text-muted">
                Search by name, member number, or father's name
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-3 d-flex gap-2 align-items-center">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={loadRequests}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={resetFilters}
            disabled={loading}
          >
            <i className="bi bi-x-circle me-1"></i>
            Reset
          </Button>
          <div className="ms-auto">
            <Badge bg="info" className="fs-6">
              {requests.length} request(s)
            </Badge>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading requests...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          <Alert.Heading>Error!</Alert.Heading>
          {error}
        </Alert>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          {requests.length === 0 ? (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              No membership requests found. Try adjusting your filters.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover className="shadow-sm">
                <thead className="table-primary">
                  <tr>
                    <th>Member Number</th>
                    <th>Name</th>
                    <th>Father's Name</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <code>{req.memberNumber}</code>
                      </td>
                      <td className="fw-semibold">{req.name}</td>
                      <td>{req.fatherName || "-"}</td>
                      <td>{req.course}</td>
                      <td>{req.yearOfJoining}</td>
                      <td>
                        <a href={`tel:${req.mobile}`} className="text-decoration-none">
                          {req.mobile}
                        </a>
                      </td>
                      <td>
                        {req.email ? (
                          <a href={`mailto:${req.email}`} className="text-decoration-none">
                            {req.email}
                          </a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => showDetails(req)}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          
                          {req.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleApprove(req._id)}
                                title="Approve"
                              >
                                <FaCheck />
                              </Button>
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={() => handleReject(req._id)}
                                title="Reject"
                              >
                                <FaTimes />
                              </Button>
                            </>
                          )}
                          
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(req._id, req)}
                            title="Delete"
                            disabled={req.status === "approved"}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Member Number:</strong>
                  <p className="text-muted">{selectedRequest.memberNumber}</p>
                </Col>
                <Col md={6}>
                  <strong>Status:</strong>
                  <p>{getStatusBadge(selectedRequest.status)}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Name:</strong>
                  <p className="text-muted">{selectedRequest.name}</p>
                </Col>
                <Col md={6}>
                  <strong>Father's Name:</strong>
                  <p className="text-muted">{selectedRequest.fatherName || "N/A"}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Course:</strong>
                  <p className="text-muted">{selectedRequest.course}</p>
                </Col>
                <Col md={6}>
                  <strong>Year of Joining:</strong>
                  <p className="text-muted">{selectedRequest.yearOfJoining}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Mobile:</strong>
                  <p className="text-muted">
                    <a href={`tel:${selectedRequest.mobile}`}>{selectedRequest.mobile}</a>
                  </p>
                </Col>
                <Col md={6}>
                  <strong>Email:</strong>
                  <p className="text-muted">
                    {selectedRequest.email ? (
                      <a href={`mailto:${selectedRequest.email}`}>{selectedRequest.email}</a>
                    ) : "N/A"}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <strong>Address:</strong>
                  <p className="text-muted">{selectedRequest.address}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Passport Photo:</strong>
                  <div className="mt-2">
                    {selectedRequest.passportPhoto ? (
                      <ShortLink url={selectedRequest.passportPhoto} />
                    ) : (
                      <span className="text-muted">Not uploaded</span>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <strong>Fee Receipt:</strong>
                  <div className="mt-2">
                    {selectedRequest.feeReceipt ? (
                      <ShortLink url={selectedRequest.feeReceipt} />
                    ) : (
                      <span className="text-muted">Not uploaded</span>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <strong>Created At:</strong>
                  <p className="text-muted">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </Col>
                <Col md={6}>
                  <strong>Updated At:</strong>
                  <p className="text-muted">
                    {new Date(selectedRequest.updatedAt).toLocaleString()}
                  </p>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default MembershipRequestsTable;

// ============================================
// Updated API Functions (requestsAPI.js)
// ============================================
/*
import api from "../../services/api";

export const FetchRequests = async (queryString = "") => {
  try {
    const response = await api.get(`/membership-requests?${queryString}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const ApproveRequest = async (id) => {
  try {
    const response = await api.post(`/membership-requests/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const RejectRequest = async (id) => {
  try {
    const response = await api.post(`/membership-requests/${id}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const DeleteRequest = async (id) => {
  try {
    const response = await api.delete(`/membership-requests/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
*/