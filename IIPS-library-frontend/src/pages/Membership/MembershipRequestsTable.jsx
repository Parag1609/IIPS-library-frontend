import React, { useEffect, useState } from "react";
import { Table, Form, Spinner, Alert } from "react-bootstrap";
import {
  FetchRequests,
  ApproveRequest,
  RejectRequest,
} from "../../features/requests/requestsAPI"; // adjust path if needed

const MembershipRequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  // ✅ Fetch membership requests
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await FetchRequests(); // calls your API wrapper
      setRequests(data.data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
   
  // ✅ Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === "approved") {
        await ApproveRequest(id);
      } else if (newStatus === "rejected") {
        await RejectRequest(id);
      }
      // locally update state
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      alert(err.message || "Failed to update request");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Membership Requests</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Enrollment No.</th>
              <th>Name</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Mobile No.</th>
              <th>Status</th>
              
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.Enrollment_Number}</td>
                <td>{req.First_Name + " " + req.Surname}</td>
                <td>{req.Course}</td>
                <td>{req.Semester}</td>
                <td>{req.Mobile}</td>              
                <td>
                  <Form.Select
                    size="sm"
                    value={req.Status}
                    onChange={(e) =>
                      handleStatusChange(req._id, e.target.value)
                    }
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
    </div>
  );
};

export default MembershipRequestsTable;
