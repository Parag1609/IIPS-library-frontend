import React, { useState } from "react";
import { Link } from "react-router-dom";   // ✅ Import Link
import "../styles/Transaction.css";

export default function Transaction() {
  const [accession, setAccession] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [caseType, setCaseType] = useState(null);

  const handleSearch = () => {
    // For now dummy logic to simulate cases
    if (accession === "111" && memberCode === "A1") {
      setCaseType("active"); // Case 1
    } else if (accession === "222" && memberCode === "B2") {
      setCaseType("none"); // Case 2
    } else {
      setCaseType("issued"); // Case 3
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

      {/* ✅ Back to Home Button */}
      <div style={{ marginTop: "20px" }}>
        <Link to="/">
          <button className="btn">⬅ Back</button>
        </Link>
      </div>
    </div>
  );
}
