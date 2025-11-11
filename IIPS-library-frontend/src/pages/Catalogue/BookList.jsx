/*import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Form, Spinner, Alert, Row, Col, Button, Badge, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchBooks } from "../../features/books/booksAPI";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    searchBy: "all",
    query: "",
    availabilityStatus: "all"
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const itemsPerPage = 10;

  // Get availability badge
  const getAvailabilityBadge = (status) => {
    const badges = {
      available: <Badge bg="success">Available</Badge>,
      issued: <Badge bg="warning" text="dark">Issued</Badge>,
      lost: <Badge bg="danger">Lost</Badge>
    };
    return badges[status] || <Badge bg="secondary">Unknown</Badge>;
  };

  // Load books with filters
  const loadBooks = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const queryParams = {
        page,
        limit: itemsPerPage
      };

      // Add search filters if provided
      if (filters.query.trim() && filters.searchBy !== 'all') {
        queryParams.searchBy = filters.searchBy;
        queryParams.query = filters.query.trim();
      }

      // Add availability filter if not 'all'
      if (filters.availabilityStatus !== 'all') {
        queryParams.availabilityStatus = filters.availabilityStatus;
      }

      const data = await fetchBooks(queryParams);

      if (data.success) {
        setBooks(data.books || []);
        setCurrentPage(data.currentPage || page);
        setTotalPages(data.totalPages || 1);
        setTotalBooks(data.totalBooks || 0);
      } else {
        throw new Error(data.message || "Failed to load books");
      }

    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      searchBy: "all",
      query: "",
      availabilityStatus: "all"
    });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    loadBooks(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle skip to page
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

  // Auto-apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBooks(1);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Count books by status
  const getStatusCounts = () => {
    const counts = {
      available: 0,
      issued: 0,
      lost: 0
    };
    books.forEach(book => {
      if (counts.hasOwnProperty(book.availabilityStatus)) {
        counts[book.availabilityStatus]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>List of Books</h2>
        <Link to="/catalogue">
          <Button variant="secondary">⬅ Back to Catalogue</Button>
        </Link>
      </div>

  
      <div className="bg-light p-3 rounded mb-4">
        <h5 className="mb-3">Filters</h5>
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Search By</Form.Label>
              <Form.Select
                value={filters.searchBy}
                onChange={(e) => handleFilterChange("searchBy", e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="publication">Publisher</option>
                <option value="accession">Accession No.</option>
                <option value="supplier">Supplier</option>
                <option value="bill">Bill Number</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Search Query</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter search term..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                disabled={filters.searchBy === 'all'}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Availability Status</Form.Label>
              <Form.Select
                value={filters.availabilityStatus}
                onChange={(e) => handleFilterChange("availabilityStatus", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="issued">Issued</option>
                <option value="lost">Lost</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2} className="d-flex align-items-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={resetFilters}
              className="w-100"
            >
              Reset Filters
            </Button>
          </Col>
        </Row>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {loading ? "Loading..." : `Showing ${books.length} of ${totalBooks} book(s)`}
          </small>
          {totalPages > 1 && (
            <Badge bg="primary">
              Page {currentPage} of {totalPages}
            </Badge>
          )}
        </div>
      </div>

      
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" />
          <p className="mt-2">Loading books...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

     
      {!loading && !error && (
        <>
          {books.length === 0 ? (
            <Alert variant="info">
              No books found. Try adjusting your filters.
            </Alert>
          ) : (
            <>
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
                    <th>Supplier</th>
                    <th>Bill No.</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td>
                        <strong className="text-primary">
                          {book.accession_number}
                        </strong>
                      </td>
                      <td><strong>{book.title}</strong></td>
                      <td>{book.author_name}</td>
                      <td className="text-center">{book.edition || 'N/A'}</td>
                      <td>{book.publication}</td>
                      <td className="text-center">{book.pages || 'N/A'}</td>
                      <td className="text-end">₹{book.rate?.toFixed(2) || '0.00'}</td>
                      <td>{book.supplier || 'N/A'}</td>
                      <td>{book.bill_number || 'N/A'}</td>
                      <td className="text-center">
                        {getAvailabilityBadge(book.availabilityStatus)}
                      </td>
                      <Form.Select
                        size="sm"
                        defaultValue=""
                        onChange={(e) => handleStatusChange(member._id, e.target.value)}
                      >
                        <option value="" disabled>Select</option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
                      </Form.Select>

                    </tr>
                  ))}
                </tbody>
              </Table>

              
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleSkipToPage}
                    >
                      Skip to Page
                    </Button>
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

          
          {books.length > 0 && (
            <div className="bg-light p-3 rounded mt-4">
              <Row>
                <Col md={3}>
                  <strong>Total Books:</strong> {totalBooks}
                </Col>
                <Col md={3}>
                  <strong>Available:</strong>{" "}
                  <Badge bg="success">{statusCounts.available}</Badge>
                </Col>
                <Col md={3}>
                  <strong>Issued:</strong>{" "}
                  <Badge bg="warning" text="dark">{statusCounts.issued}</Badge>
                </Col>
                <Col md={3}>
                  <strong>Lost:</strong>{" "}
                  <Badge bg="danger">{statusCounts.lost}</Badge>
                </Col>
              </Row>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;
*/

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Form, Spinner, Alert, Row, Col, Button, Badge, Pagination, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchBooks, deleteBook, updateBook } from "../../features/books/booksAPI";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    searchBy: "all",
    query: "",
    availabilityStatus: "all"
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const itemsPerPage = 10;

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  // Get availability badge
  const getAvailabilityBadge = (status) => {
    const badges = {
      available: <Badge bg="success">Available</Badge>,
      issued: <Badge bg="warning" text="dark">Issued</Badge>,
      lost: <Badge bg="danger">Lost</Badge>
    };
    return badges[status] || <Badge bg="secondary">Unknown</Badge>;
  };

  // Load books with filters
  const loadBooks = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const queryParams = {
        page,
        limit: itemsPerPage
      };

      // Add search filters if provided
      if (filters.query.trim() && filters.searchBy !== 'all') {
        queryParams.searchBy = filters.searchBy;
        queryParams.query = filters.query.trim();
      }

      // Add availability filter if not 'all'
      if (filters.availabilityStatus !== 'all') {
        queryParams.availabilityStatus = filters.availabilityStatus;
      }

      const data = await fetchBooks(queryParams);

      if (data.success) {
        setBooks(data.books || []);
        setCurrentPage(data.currentPage || page);
        setTotalPages(data.totalPages || 1);
        setTotalBooks(data.totalBooks || 0);
      } else {
        throw new Error(data.message || "Failed to load books");
      }

    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      searchBy: "all",
      query: "",
      availabilityStatus: "all"
    });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    loadBooks(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle skip to page
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

  // Open delete modal
  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedBook(null);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedBook) return;

    setActionLoading(true);
    try {
      await deleteBook(selectedBook._id);
      toast.success("Book deleted successfully");
      handleCloseDeleteModal();
      loadBooks(currentPage); // Reload current page
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete book";
      toast.error(errorMsg);
      
      // If book is issued, show the error details
      if (err.response?.data?.issuedTo) {
        const issuedTo = err.response.data.issuedTo;
        toast.warning(`Book is issued to: ${issuedTo.map(m => m.memberName).join(', ')}`);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Open edit modal
  const handleEditClick = (book) => {
    setSelectedBook(book);
    setEditFormData({
      title: book.title || "",
      author_name: book.author_name || "",
      publication: book.publication || "",
      edition: book.edition || "",
      pages: book.pages || "",
      rate: book.rate || "",
      accession_number: book.accession_number || "",
      supplier: book.supplier || "",
      bill_number: book.bill_number || "",
      availabilityStatus: book.availabilityStatus || "available"
    });
    setShowEditModal(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedBook(null);
    setEditFormData({});
  };

  // Handle edit form change
  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  // Submit edit form
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;

    setActionLoading(true);
    try {
      await updateBook(selectedBook._id, editFormData);
      toast.success("Book updated successfully");
      handleCloseEditModal();
      loadBooks(currentPage); // Reload current page
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to update book";
      toast.error(errorMsg);
    } finally {
      setActionLoading(false);
    }
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

  // Auto-apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBooks(1);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Count books by status
  const getStatusCounts = () => {
    const counts = {
      available: 0,
      issued: 0,
      lost: 0
    };
    books.forEach(book => {
      if (counts.hasOwnProperty(book.availabilityStatus)) {
        counts[book.availabilityStatus]++;
      }
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="page">
      <h1 className="title" >Membership Requests</h1>
    <div className="container mt-4">
      <div className="tableBox">

      {/* Filters Section */}
      <div className="bg-light p-3 rounded mb-4">
        <h5 className="mb-3">Filters</h5>
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Search By</Form.Label>
              <Form.Select
                value={filters.searchBy}
                onChange={(e) => handleFilterChange("searchBy", e.target.value)}
              >
                <option value="all">All Fields</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="publication">Publisher</option>
                <option value="accession">Accession No.</option>
                <option value="supplier">Supplier</option>
                <option value="bill">Bill Number</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Search Query</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter search term..."
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                disabled={filters.searchBy === 'all'}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Availability Status</Form.Label>
              <Form.Select
                value={filters.availabilityStatus}
                onChange={(e) => handleFilterChange("availabilityStatus", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="issued">Issued</option>
                <option value="lost">Lost</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={2} className="d-flex align-items-end">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={resetFilters}
              className="w-100"
            >
              Reset Filters
            </Button>
          </Col>
        </Row>

        <div className="mt-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {loading ? "Loading..." : `Showing ${books.length} of ${totalBooks} book(s)`}
          </small>
          {totalPages > 1 && (
            <Badge bg="primary">
              Page {currentPage} of {totalPages}
            </Badge>
          )}
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" />
          <p className="mt-2">Loading books...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Table */}
      {!loading && !error && (
        <>
          {books.length === 0 ? (
            <Alert variant="info">
              No books found. Try adjusting your filters.
            </Alert>
          ) : (
            <>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td>
                        <strong className="text-primary">
                          {book.accession_number}
                        </strong>
                      </td>
                      <td><strong>{book.title}</strong></td>
                      <td>{book.author_name}</td>
                      <td className="text-center">{book.edition || 'N/A'}</td>
                      <td>{book.publication}</td>
                      <td className="text-center">{book.pages || 'N/A'}</td>
                      <td className="text-end">₹{book.rate?.toFixed(2) || '0.00'}</td>
                      <td className="text-center">
                        {getAvailabilityBadge(book.availabilityStatus)}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(book)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(book)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <Button 
                      variant="outline-primary"
                      size="sm"
                      onClick={handleSkipToPage}
                    >
                      Skip to Page
                    </Button>
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

          {/* Summary */}
          {books.length > 0 && (
            <div className="bg-light p-3 rounded mt-4">
              <Row>
                <Col md={3}>
                  <strong>Total Books:</strong> {totalBooks}
                </Col>
                <Col md={3}>
                  <strong>Available:</strong>{" "}
                  <Badge bg="success">{statusCounts.available}</Badge>
                </Col>
                <Col md={3}>
                  <strong>Issued:</strong>{" "}
                  <Badge bg="warning" text="dark">{statusCounts.issued}</Badge>
                </Col>
                <Col md={3}>
                  <strong>Lost:</strong>{" "}
                  <Badge bg="danger">{statusCounts.lost}</Badge>
                </Col>
              </Row>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <>
              <p>Are you sure you want to delete this book?</p>
              <div className="bg-light p-3 rounded">
                <p className="mb-1"><strong>Title:</strong> {selectedBook.title}</p>
                <p className="mb-1"><strong>Author:</strong> {selectedBook.author_name}</p>
                <p className="mb-1"><strong>Accession No:</strong> {selectedBook.accession_number}</p>
                <p className="mb-0"><strong>Status:</strong> {selectedBook.availabilityStatus}</p>
              </div>
              <Alert variant="warning" className="mt-3 mb-0">
                <small>⚠️ This action cannot be undone. If the book is currently issued, deletion will be prevented.</small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={actionLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={actionLoading}>
            {actionLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete Book'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Book Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Book Details</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEdit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => handleEditFormChange('title', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Author Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.author_name}
                    onChange={(e) => handleEditFormChange('author_name', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Publisher <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.publication}
                    onChange={(e) => handleEditFormChange('publication', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Accession Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.accession_number}
                    onChange={(e) => handleEditFormChange('accession_number', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Edition</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.edition}
                    onChange={(e) => handleEditFormChange('edition', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Pages</Form.Label>
                  <Form.Control
                    type="number"
                    value={editFormData.pages}
                    onChange={(e) => handleEditFormChange('pages', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Rate (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={editFormData.rate}
                    onChange={(e) => handleEditFormChange('rate', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Supplier</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.supplier}
                    onChange={(e) => handleEditFormChange('supplier', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Bill Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={editFormData.bill_number}
                    onChange={(e) => handleEditFormChange('bill_number', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Availability Status</Form.Label>
                  <Form.Select
                    value={editFormData.availabilityStatus}
                    onChange={(e) => handleEditFormChange('availabilityStatus', e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="issued">Issued</option>
                    <option value="lost">Lost</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      </div>
    </div>
    </div>
  );
};

export default BookList;