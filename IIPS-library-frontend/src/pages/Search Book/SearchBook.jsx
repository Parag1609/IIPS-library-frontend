import React, { useState } from "react";
import { Link } from "react-router-dom";  // ✅ Import Link
import "./../styles/SearchBook.css";

function SearchBook() {
  const [searchBy, setSearchBy] = useState("Title");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const handleSearch = () => {
    // Dummy data (replace later with DB/API call)
    const dummyBooks = [
      { title: "Java Programming", author: "Herbert Schildt", publisher: "McGraw Hill", accession: "101" },
      { title: "Data Structures", author: "Mark Allen Weiss", publisher: "Pearson", accession: "102" },
      { title: "Operating System", author: "Galvin", publisher: "Wiley", accession: "103" },
    ];

    let filtered = dummyBooks.filter((book) => {
      if (searchBy === "Title") return book.title.toLowerCase().includes(query.toLowerCase());
      if (searchBy === "Author") return book.author.toLowerCase().includes(query.toLowerCase());
      if (searchBy === "Publisher") return book.publisher.toLowerCase().includes(query.toLowerCase());
      if (searchBy === "Accession No.") return book.accession === query;
      return false;
    });

    setResults(filtered);
  };

  return (
    <div className="home">
      <div className="header">
        <h1>Search Book</h1>
      </div>

      <div className="search-box">
        <label>Search By:</label>
        <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
          <option>Title</option>
          <option>Author</option>
          <option>Publisher</option>
          <option>Accession No.</option>
        </select>

        <input
          type="text"
          placeholder={`Enter ${searchBy}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      {results && (
        <div className="results">
          <h2>Search Results:</h2>
          {results.length > 0 ? (
            <ul>
              {results.map((book, index) => (
                <li key={index}>
                  <strong>Title:</strong> {book.title} <br />
                  <strong>Author:</strong> {book.author} <br />
                  <strong>Publisher:</strong> {book.publisher} <br />
                  <strong>Accession No.:</strong> {book.accession}
                  <hr />
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found</p>
          )}
        </div>
      )}

      {/* ✅ Back to Home Button */}
      <div style={{ marginTop: "20px" }}>
        <Link to="/">
            <button className="btn">Back</button>
            </Link>
      </div>
    </div>
  );
}

export default SearchBook;
