import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./SearchMember.module.css";

export default function SearchMember() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      // navigate to member details page (URL-encoded)
      navigate(`/member/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Search Member</h1>
      </header>

      <div className={styles.searchBox}>
        <span className={styles.icon}>🔍</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter member name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <button className={styles.searchBtn} onClick={handleSearch}>
        Search
      </button>

      
      <Link to="/membership">
    <button className="btn">Back</button>
    </Link>

    </div>
  );
}
