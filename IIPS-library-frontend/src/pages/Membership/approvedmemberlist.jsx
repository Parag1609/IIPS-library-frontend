import React, { useEffect, useState } from "react";
import { Table, Form, Spinner, Alert, Row, Col, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  fetchMembers,
  updateCardStatus,
  DownloadCards
} from "../../features/members/membersAPI";

const ApprovedMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    cardStatus: "all",
    course: "all",
    semester: "all"
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);

  // Get status badge style
  const getStatusStyle = (status) => {
    const styles = {
      active: {
        backgroundColor: "#28a745",
        color: "#fff",
        fontWeight: "500"
      },
      inactive: {
        backgroundColor: "#dc3545",
        color: "#fff",
        fontWeight: "500"
      }
    };
    return styles[status] || {};
  };

  // Load members with filters
  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });

      const data = await fetchMembers(queryParams.toString());
      setMembers(data.data || []);
      setTotalMembers(data.totalMembers || data.data?.length || 0);

    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateCardStatus(id, newStatus);

      // Update local state
      setMembers((prev) =>
        prev.map((member) =>
          member._id === id ? { ...member, cardStatus: newStatus } : member
        )
      );

      toast.success(`Card status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      cardStatus: "all",
      course: "all",
      semester: "all"
    });
  };

  // Download library cards
  const handleDownloadCards = async () => {
    setDownloadLoading(true);
    try {
      // Build filters for download
      const downloadFilters = {};
      if (filters.course && filters.course !== 'all') {
        downloadFilters.course = filters.course;
      }
      if (filters.semester && filters.semester !== 'all') {
        downloadFilters.semester = filters.semester;
      }
      if (filters.cardStatus && filters.cardStatus !== 'all') {
        downloadFilters.cardStatus = filters.cardStatus;
      }
      if (filters.search && filters.search.trim()) {
        downloadFilters.search = filters.search.trim();
      }

      const blob = await DownloadCards(downloadFilters);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `library-cards-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Library cards downloaded successfully!");

    } catch (err) {
      console.error('Download error:', err);
      toast.error(err.message || "Failed to download library cards");
    } finally {
      setDownloadLoading(false);
    }
  };

  // Auto-apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadMembers();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Approved Member List</h2>
        <Button
          variant="success"
          onClick={handleDownloadCards}
          disabled={downloadLoading || members.length === 0}
        >
          {downloadLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Downloading...
            </>
          ) : (
            <>
              📥 Download Cards PDF
            </>
          )}
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-light p-3 rounded mb-4">
        <h5 className="mb-3">Filters</h5>
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name, ID, Mobile..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Card Status</Form.Label>
              <Form.Select
                value={filters.cardStatus}
                onChange={(e) => handleFilterChange("cardStatus", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
        </Row>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
          <small className="text-muted">
            Showing {members.length} member(s)
          </small>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" />
          <p className="mt-2">Loading members...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Table */}
      {!loading && !error && (
        <>
          {members.length === 0 ? (
            <Alert variant="info">
              No members found. Try adjusting your filters.
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Member ID</th>
                  <th>Enrollment No</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Mobile No.</th>
                  <th>Card Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <strong className="text-primary">
                        {member.memberId}
                      </strong>
                    </td>
                    <td>{member.enrollment_number}</td>
                    <td>
                      {member.firstName} {member.lastName || member.surname}
                    </td>
                    <td>{member.course}</td>
                    <td className="text-center">{member.semester}</td>
                    <td>{member.mobile}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={member.cardStatus}
                        onChange={(e) =>
                          handleStatusChange(member._id, e.target.value)
                        }
                        style={getStatusStyle(member.cardStatus)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Summary */}
          {members.length > 0 && (
            <div className="bg-light p-3 rounded">
              <Row>
                <Col md={4}>
                  <strong>Total Members:</strong> {members.length}
                </Col>
                <Col md={4}>
                  <strong>Active:</strong>{" "}
                  {members.filter(m => m.cardStatus === 'active').length}
                </Col>
                <Col md={4}>
                  <strong>Inactive:</strong>{" "}
                  {members.filter(m => m.cardStatus === 'inactive').length}
                </Col>
              </Row>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApprovedMemberList;