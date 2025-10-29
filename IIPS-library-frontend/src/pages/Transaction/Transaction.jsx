import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../../styles/Transaction.css";

export default function Transaction() {
  const [accession, setAccession] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [caseType, setCaseType] = useState(null);

  // ✅ Dummy transaction data for display
  const [transactions] = useState([
    {
      id: 1,
      bookId: "B001",
      bookTitle: "The Alchemist",
      memberName: "Rahul Sharma",
      memberCode: "A1",
      issueDate: "2025-10-20",
      dueDate: "2025-11-05",
    },
    {
      id: 2,
      bookId: "B002",
      bookTitle: "Rich Dad Poor Dad",
      memberName: "Priya Verma",
      memberCode: "B2",
      issueDate: "2025-10-22",
      dueDate: "2025-11-07",
    },
  ]);

  const handleSearch = () => {
    if (accession === "111" && memberCode === "A1") {
      setCaseType("active"); // Book already issued to this member
    } else if (accession === "222" && memberCode === "B2") {
      setCaseType("none"); // No active transaction
    } else {
      setCaseType("issued"); // Book issued to someone else
    }
  };

  return (
    <div className="transaction-container">
      <h1 className="transaction-title">Transaction</h1>

      <div className="transaction-inputs">
        <input
          type="text"
          placeholder="Enter Accession No."
          value={accession}
          onChange={(e) => setAccession(e.target.value)}
          className="transaction-input"
        />
        <input
          type="text"
          placeholder="Enter Member Code"
          value={memberCode}
          onChange={(e) => setMemberCode(e.target.value)}
          className="transaction-input"
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="transaction-result">
        {caseType === "active" && (
          <div className="case-box">
            <p>Active Transaction</p>
            <button className="return-btn">Return</button>
          </div>
        )}
        {caseType === "none" && (
          <div className="case-box">
            <p>No active transaction</p>
            <button className="issue-btn">Issue</button>
          </div>
        )}
        {caseType === "issued" && (
          <div className="case-box">
            <p>
              <strong>“This book is already issued by another member”</strong>
            </p>
          </div>
        )}
      </div>

      {/* ✅ Back Button */}
      <div style={{ marginTop: "20px" }}>
        <Link to="/">
          <button className="btn">⬅ Back</button>
        </Link>
      </div>

      {/* ✅ Active Transaction Details Below Back Button */}
      <div className="transaction-table-container" style={{ marginTop: "30px" }}>
        <h2>Active Transactions</h2>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Book Title</th>
              <th>Member Name</th>
              <th>Member Code</th>
              <th>Issue Date</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.bookId}</td>
                <td>{t.bookTitle}</td>
                <td>{t.memberName}</td>
                <td>{t.memberCode}</td>
                <td>{t.issueDate}</td>
                <td>{t.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
