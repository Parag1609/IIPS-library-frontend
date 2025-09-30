import { useState } from "react";
import { Link } from "react-router-dom";
import "./../../styles/MemberDetails.css";

export default function SearchMember() {
  const [memberName, setMemberName] = useState("");

  return (
    <div className="search-container">
      <div className="header">
        <h1>Search Member</h1>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Member Name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
        />
        {/* ✅ Navigate to details page */}
        <Link to={`/membership/details/${memberName}`}>
          <button disabled={!memberName}>Search</button>
        </Link>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Link to="/membership">
          <button>⬅ Back</button>
        </Link>
      </div>
    </div>
  );
}
