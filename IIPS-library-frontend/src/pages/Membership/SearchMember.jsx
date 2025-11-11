import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "./../../styles/MemberDetails.css";
import { fetchMemberByMemberId } from "../../features/members/membersAPI";

export default function SearchMember() {
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!memberId.trim()) {
      toast.warning("Please enter a member ID");
      return;
    }

    setLoading(true);
    try {
      // Verify member exists before navigating
      const data = await fetchMemberByMemberId(memberId.trim());
      
      if (data.success) {
        // Navigate to details page with member ID
        navigate(`/membership/details/${memberId.trim()}`);
      } else {
        toast.error("Member not found");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error(error.response?.data?.message || "Member not found");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <div className="header">
        <h1>Search Member</h1>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Scan Member's Barcode or Enter Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          autoFocus
        />
        <button 
          onClick={handleSearch} 
          disabled={!memberId.trim() || loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : "Search"}
        </button>
      </div>
    </div>
  );
}