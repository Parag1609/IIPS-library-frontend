import React, { useEffect, useState } from "react";
import { Table, Form, Spinner, Alert } from "react-bootstrap";
import {
  fetchMembers,
  fetchMemberById,
  updateCardStatus,
} from "../../features/members/membersAPI";

const ApprovedMemberList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status,setStatus] = useState("");

  const loadMembers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMembers(); // calls your API wrapper
        setRequests(data.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const loadMembersById = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchMemberById(); // calls your API wrapper
        setRequests(data.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
          await updateCardStatus(id,newStatus)
          
          setStatus(newStatus);
        } catch (err) {
          alert(err.message || "Failed to update request");
        }
      };
    
    useEffect(() => {
        loadMembers();
      }, [status]);
    
      return (
        <div className="container mt-4">
          <h2>Approved Member List</h2>
    
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
    
          {!loading && !error && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Enrollment No</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Mobile No.</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.enrollment_number}</td>
                    <td>{req.firstName + " " + req.surname}</td>
                    <td>{req.course}</td>
                    <td>{req.semester}</td>
                    <td>{req.mobile}</td>
                    <td>
                        <Form.Select
                          size="sm"
                          value={req.cardStatus}
                          onChange={(e) =>
                          handleStatusChange(req._id, e.target.value)
                          }
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
        </div>
      );
    };

export default ApprovedMemberList;