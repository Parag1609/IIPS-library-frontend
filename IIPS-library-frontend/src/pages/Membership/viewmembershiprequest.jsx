import React, { useEffect, useState } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
fetchRequestsAsync,
approveRequestAsync,
rejectRequestAsync
} from "../../features/requests/requestsSlice";
import { selectRequestsLoading ,selectRequestsError, selectRequests} from "../../features/requests/requestsSlice";

const MembershipRequestsTable = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRequestsAsync());
    console.log(selectRequests,"a");
  }, [dispatch,selectRequests]);

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "approved") {
      dispatch(approveRequestAsync(id));
    } else if (newStatus === "rejected") {
      dispatch(rejectRequestAsync(id));
    }
    // pending case: do nothing (or you can add reset API if required)
  };

  return (
    <div className="container mt-4">
      <h2>Membership Requests</h2>
      {/* Table */}
      {selectRequestsLoading.upload ? (
        <p>Loading...</p>
      ) : selectRequestsError ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Enrollment No. </th>
              <th>Name</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Mobile No.</th>
              <th>Fee Receipt</th>
              <th>Photo</th>
              <th>Status</th>
              
            </tr>
          </thead>
          <tbody>
            {selectRequests.map((req) => (
              <tr key={req._id}>
                <td>{req.Enrollment_Number}</td>
                <td>{req.First_Name + " " + req.Surname}</td>
                <td>{req.Course}</td>
                <td>{req.Semester}</td>
                <td>{req.Mobile}</td>
                <td>{req.Course}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={req.status}
                    onChange={(e) => handleStatusChange(req._id, e.target.value)}
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

      {/* Upload Modal */}
      <UploadCSVModal open={showUpload} handleClose={() => setShowUpload(false)} />
    </div>
  );
};

export default MembershipRequestsTable;