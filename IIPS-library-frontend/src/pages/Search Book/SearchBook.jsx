import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Alert, Spinner, Badge, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchBooks } from "../../features/books/booksAPI";
import "./../../styles/SearchBook.css";

function SearchBook() {
  const [searchBy, setSearchBy] = useState("Title");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [itemsPerPage] = useState(1);

  const handleSearch = async (page = 1) => {
    if (!query.trim()) {
      toast.warning("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      // Map display values to API values
      const searchByMap = {
        "Title": "title",
        "Author": "author",
        "Publisher": "publication",
        "Accession No.": "accession"
      };

      const filters = {
        searchBy: searchByMap[searchBy],
        query: query.trim(),
        page: page,
        limit: itemsPerPage
      };

      const data = await fetchBooks(filters);
      
      if (data.success) {
        setResults(data.books || []);
        setCurrentPage(data.currentPage || page);
        setTotalPages(data.totalPages || 1);
        setTotalBooks(data.totalBooks || data.books?.length || 0);
        
        if (data.books?.length > 0) {
          toast.success(`Found ${data.totalBooks} book(s)`);
        } else {
          toast.info("No books found matching your search");
        }
      } else {
        throw new Error(data.message || "Search failed");
      }

    } catch (err) {
      console.error("Search error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to search books";
      setError(errorMessage);
      toast.error(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(1);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setError("");
    setCurrentPage(1);
    setTotalPages(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    handleSearch(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSkipToPage = () => {
    const pageNum = prompt(`Enter page number (1-${totalPages}):`);
    if (pageNum) {
      const page = parseInt(pageNum);
      if (page >= 1 && page <= totalPages) {
        handlePageChange(page);
      } else {
        toast.error(`Please enter a valid page number between 1 and ${totalPages}`);
      }
    }
  };

  const getAvailabilityBadge = (status) => {
    const badges = {
      available: <Badge bg="success">Available</Badge>,
      issued: <Badge bg="warning" text="dark">Issued</Badge>,
      lost: <Badge bg="danger">Lost</Badge>
    };
    return badges[status] || <Badge bg="secondary">Unknown</Badge>;
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => handlePageChange(1)} />
      );
    }

    // Previous
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    // Next
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );

    // Last page
    if (endPage < totalPages) {
      items.push(
        <Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} />
      );
    }

    return items;
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
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <button onClick={() => handleSearch(1)} disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
        
        {searched && (
          <button onClick={handleClear} disabled={loading}>
            Clear
          </button>
        )}
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Searching for books...</p>
        </div>
      )}

      {!loading && searched && (
        <>
          {results.length === 0 ? (
            <Alert variant="info">
              <h5>No Results Found</h5>
              <p className="mb-0">
                No books found matching "{query}" in {searchBy}. 
                Try adjusting your search criteria.
              </p>
            </Alert>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Search Results</h4>
                <Badge bg="primary" className="fs-6">
                  Page {currentPage} of {totalPages} ({totalBooks} total books)
                </Badge>
              </div>

              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>Accession No.</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Edition</th>
                    <th>Publisher</th>
                    <th>Pages</th>
                    <th>Rate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((book, index) => (
                    <tr key={book._id || index}>
                      <td>
                        <strong className="text-primary">
                          {book.accession_number}
                        </strong>
                      </td>
                      <td><strong>{book.title}</strong></td>
                      <td>{book.author_name}</td>
                      <td className="text-center">{book.edition}</td>
                      <td>{book.publication}</td>
                      <td className="text-center">{book.pages || 'N/A'}</td>
                      <td className="text-end">Rs.{book.rate?.toFixed(2) || '0.00'}</td>
                      <td className="text-center">
                        {getAvailabilityBadge(book.availabilityStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={handleSkipToPage}
                    >
                      Skip to Page
                    </button>
                  </div>

                  <Pagination className="mb-0">
                    {getPaginationItems()}
                  </Pagination>

                  <div className="text-muted">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalBooks)} of {totalBooks}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {!searched && !loading && (
        <Alert variant="light" className="text-center">
          <h5>Search for Books</h5>
          <p className="mb-0">
            Select a search type, enter your query, and click "Search" to find books.
          </p>
        </Alert>
      )}
    </div>
  );
}

export default SearchBook;