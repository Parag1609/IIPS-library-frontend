/*import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../../styles/MemberDetails.css";
import { fetchMemberByMemberId } from "../../features/members/membersAPI";

export default function MemberDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // later for fetching backend data

  useEffect(()=>{
     fetchMemberByMemberId(id);
  },[id])

  // Dummy member data
  const [member] = useState({
    name: "ABC",
    memberId: "78553",
    course: "XYZ",
    validity: "20XX - 20YY",
    booksIssued: 3,
    status: "Active",
    barcode: "123456789012",
    photo: "/member.png", // keep dummy img in public/
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      alert("Member deleted!");
    }
  };

  const handleEdit = () => {
    alert("Edit feature coming soon!");
  };

  const handleDownload = () => {
    alert("Download feature coming soon!");
  };

  return (
    <div className="member-details-page">
      <h1 className="page-title"> Member Details </h1>

    
      <div className="library-card">
        <h2 className="card-title">Library Card</h2>

        <div className="card-content">
          <div className="card-left">
            <p><strong>Name:</strong> {member.name}</p>
            <p><strong>Member-Id:</strong> {member.memberId}</p>
            <p><strong>Course:</strong> {member.course}</p>
            <p><strong>Validity:</strong> {member.validity}</p>

            <div className="barcode-row">
              <span className="barcode">Barcode: {member.barcode}</span>
            </div>
          </div>

          <div className="card-right">
            <img src={member.photo} alt="Member" className="member-photo" />
             <div className="button-group">
  <button className="delete-btn" onClick={handleDelete}>Delete</button>
  <button className="edit-btn" onClick={handleEdit}>Edit</button>
  <button className="download-btn" onClick={handleDownload}>Download</button>
</div>

          </div>
        </div>
      </div>

  
      <div className="extra-details">
        <p><strong>No. of books issued:</strong> {member.booksIssued}</p>
        <p><strong>Card Status:</strong> {member.status}</p>
      </div>

     
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
*/
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner, Alert, Badge, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import "./../../styles/MemberDetails.css";
import { fetchMemberByMemberId } from "../../features/members/membersAPI";

export default function MemberDetails() {
  const navigate = useNavigate();
  const {memberId} = useParams(); // Get memberId from URL params

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch member data when component mounts or id changes
  useEffect(() => {
    console.log(memberId)
    const loadMemberDetails = async () => {
      if (!memberId) {
        setError("No member ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await fetchMemberByMemberId(memberId);
        
        if (data.success) {
          setMember(data.data);
          toast.success("Member details loaded");
        } else {
          throw new Error(data.message || "Failed to load member details");
        }
      } catch (err) {
        console.error("Error loading member:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load member details";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadMemberDetails();
  }, [memberId]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete member ${member?.membershipId}?`)) {
      // TODO: Implement delete API call
      toast.success("Delete feature coming soon!");
    }
  };

  const handleEdit = () => {
    // Navigate to edit page
    navigate(`/membership/edit/${id}`);
    toast.info("Edit feature coming soon!");
  };

  const handleDownload = () => {
    // TODO: Implement download library card
    toast.info("Download feature coming soon!");
  };

  // Loading state
  if (loading) {
    return (
      <div className="member-details-page">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading member details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="member-details-page">
        <Alert variant="danger">
          <h5>Error Loading Member</h5>
          <p>{error}</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </Alert>
      </div>
    );
  }

  // No member found
  if (!member) {
    return (
      <div className="member-details-page">
        <Alert variant="warning">
          <h5>Member Not Found</h5>
          <p>No member found with ID: {id}</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </Alert>
      </div>
    );
  }

  // Success - Display member details
  return (
    <div className="member-details-page">
      <h1 className="page-title">Member Details</h1>

      {/* Library Card */}
      <div className="library-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="card-title mb-0">Library Card</h2>
          {member.cardStatus === 'active' ? (
            <Badge bg="success">Active</Badge>
          ) : (
            <Badge bg="danger">Inactive</Badge>
          )}
        </div>

        <div className="card-content">
          <div className="card-left">
            <p><strong>Name:</strong> {member.name}</p>
            <p><strong>Member Type:</strong> {member.memberType}</p>
            <p><strong>Membership ID:</strong> {member.membershipId}</p>
            <p><strong>Member No:</strong> {member.memberNumber}</p>
            <p><strong>Course:</strong> {member.course || "NA"}</p>
            <p><strong>Mobile:</strong> {member.mobile}</p>

            <div className="barcode-row">
              <span className="barcode">Member ID: {member.membershipId}</span>
              {/* You can add actual barcode rendering here */}
            </div>
          </div>

          <div className="card-right">
            {member.photo ? (
              <img 
                src={member.photo} 
                alt="Member" 
                className="member-photo"
              />
            ) : (
              <div className="member-photo-placeholder">
                <span>No Photo</span>
              </div>
            )}
            
            <div className="button-group">
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
              <button className="edit-btn" onClick={handleEdit}>
                Edit
              </button>
              <button className="download-btn" onClick={handleDownload}>
                Download Card
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Details Below Card */}
      <div className="extra-details">
        <Table bordered className="mt-4">
          <tbody>
            <tr>
              <th style={{ width: '30%' }}>No. of books issued:</th>
              <td>
                <Badge bg={member.activeIssuedCount > 0 ? 'warning' : 'success'}>
                  {member.issuedBooks.length || 0} / {member.bookIssueLimit || 3}
                </Badge>
                {member.canIssueMore ? (
                  <span className="text-success ms-2">✓ Can issue more books</span>
                ) : (
                  <span className="text-danger ms-2">✗ Limit reached</span>
                )}
              </td>
            </tr>
            <tr>
              <th>Card Status:</th>
              <td>
                {member.cardStatus === 'active' ? (
                  <Badge bg="success">Active</Badge>
                ) : (
                  <Badge bg="danger">{member.cardStatus || 'Inactive'}</Badge>
                )}
              </td>
            </tr>
            <tr>
              <th>Member Since:</th>
              <td>{new Date(member.createdAt).toLocaleDateString()}</td>
            </tr>
            {member.validUpto && (
              <tr>
                <th>Valid Until:</th>
                <td>{new Date(member.validUpto).toLocaleDateString()}</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Show issued books if any */}
        {member.issuedBooks && member.issuedBooks.length > 0 && (
          <div className="mt-4">
            <h5>Currently Issued Books</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Accession No.</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {member.issuedBooks.map((book, index) => (
                  <tr key={index}>
                    <td>{book.title || 'N/A'}</td>
                    <td>{book.accession_number || 'N/A'}</td>
                    <td>{book.issueDate ? new Date(book.issueDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
    </div>
  );
}