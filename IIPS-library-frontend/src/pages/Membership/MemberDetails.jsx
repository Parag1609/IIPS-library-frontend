import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/MemberDetails.css";

export default function MemberDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // later for fetching backend data

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
      <h1 className="page-title">Search Member</h1>

      {/* Library Card */}
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

      {/* Extra Details Below Card */}
      <div className="extra-details">
        <p><strong>No. of books issued:</strong> {member.booksIssued}</p>
        <p><strong>Card Status:</strong> {member.status}</p>
      </div>

     
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
