/*import React, { useState } from "react";
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

      
      <div style={{ marginTop: "20px" }}>
        <Link to="/">
          <button className="btn">⬅ Back</button>
        </Link>
      </div>

    
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
*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Button, Spinner, Alert, Badge, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { IssueBook, ReturnBook } from "../../features/transactions/transactionsAPI";
import { fetchMemberByMemberId } from "../../features/members/membersAPI";
import { fetchBooks } from "../../features/books/booksAPI";
import "./../../styles/Transaction.css";

export default function Transaction() {
  const [accessionNumber, setAccessionNumber] = useState("");
  const [memberId, setMemberId] = useState("");

  // State for fetched data
  const [member, setMember] = useState(null);
  const [book, setBook] = useState(null);
  const [transaction, setTransaction] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  // Transaction state
  const [transactionType, setTransactionType] = useState(null); // 'issue', 'return', 'already_issued'

  const handleSearch = async () => {
    if (!accessionNumber.trim() || !memberId.trim()) {
      toast.warning("Please enter both Accession Number and Member ID");
      return;
    }

    setSearching(true);
    setError("");
    setTransactionType(null);
    setMember(null);
    setBook(null);
    setTransaction(null);

    try {
      // Fetch member details
      const memberData = await fetchMemberByMemberId(memberId.trim());
      if (!memberData.success) {
        throw new Error("Member not found");
      }
      setMember(memberData.data);

      // Check if member card is active
      if (memberData.data.cardStatus !== 'active') {
        throw new Error("Member card is not active");
      }

      // Fetch book details
      const bookFilters = {
        searchBy: 'accession',
        query: accessionNumber.trim()
      };
      const bookData = await fetchBooks(bookFilters);

      if (!bookData.success || !bookData.books || bookData.books.length === 0) {
        throw new Error("Book not found");
      }

      const foundBook = bookData.books[0];
      setBook(foundBook);

      // Determine transaction type based on book availability
      if (foundBook.availabilityStatus === 'available') {
        // Check if member has reached limit
        const issuedCount = memberData.data.issuedBooks?.length || 0;
        const maxAllowed = memberData.data.maxBooksAllowed || 3;

        if (issuedCount >= maxAllowed) {
          toast.error(`Member has reached maximum book limit (${maxAllowed})`);
          setTransactionType('limit_reached');
        } else {
          setTransactionType('issue');
          toast.info("Book is available for issue");
        }
      } else if (foundBook.availabilityStatus === 'issued') {
        // Check if issued to this member
        console.log(memberData)
        const isIssuedToMember = memberData.data.issuedBooks?.some(
          book => (book._id || book).toString() === foundBook._id.toString()
        );


        if (isIssuedToMember) {
          setTransactionType('return');
          toast.info("Book is issued to this member");
        } else {
          setTransactionType('already_issued');
          toast.warning("Book is issued to another member");
        }
      } else {
        setTransactionType('unavailable');
        toast.error("Book is not available");
      }

    } catch (err) {
      console.error("Search error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error searching";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSearching(false);
    }
  };

  const handleIssueBook = async () => {
    setLoading(true);
    try {
      const issueDetails = {
        memberId: member.memberId,
        bookId: book.accession_number
      };

      const result = await IssueBook(issueDetails);

      if (result.success) {
        toast.success("Book issued successfully!");
        setTransaction(result.transaction);
        setTransactionType('issued_success');

        // Update local state
        setBook({ ...book, availabilityStatus: 'issued' });
        setMember({
          ...member,
          issuedBooks: [...(member.issuedBooks || []), book._id]
        });
      }
    } catch (err) {
      console.error("Issue error:", err);
      toast.error(err.response?.data?.message || "Failed to issue book");
    } finally {
      setLoading(false);
    }
  };

 // Update the handleReturnBook function in your component
const handleReturnBook = async () => {
  setLoading(true);
  try {
    const returnDetails= { memberId : member.memberId, bookId: book.accession_number}
    const result = await ReturnBook(returnDetails);
    
    if (result.success) {
      toast.success(result.message);
      setTransaction(result.transaction);
      setTransactionType('returned_success');
      
      // Update local state
      setBook({ ...book, availabilityStatus: 'available' });
      setMember({
        ...member,
        issuedBooks: member.issuedBooks.filter(b => (b._id||b).toString() !== book._id.toString())
      });
    }
  } catch (err) {
    console.error("Return error:", err);
    toast.error(err.response?.data?.message || "Failed to return book");
  } finally {
    setLoading(false);
  }
};

  const handleClear = () => {
    setAccessionNumber("");
    setMemberId("");
    setMember(null);
    setBook(null);
    setTransaction(null);
    setTransactionType(null);
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="transaction-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="transaction-title">Book Transaction</h1>
        <Link to="/">
          <Button variant="secondary">⬅ Back</Button>
        </Link>
      </div>

      {/* Search Section */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={5}>
              <label className="form-label fw-semibold">Accession Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Scan or enter accession number..."
                value={accessionNumber}
                onChange={(e) => setAccessionNumber(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={searching || loading}
                autoFocus
              />
            </Col>
            <Col md={5}>
              <label className="form-label fw-semibold">Member ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Scan or enter member ID..."
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={searching || loading}
              />
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button
                variant="primary"
                className="w-100"
                onClick={handleSearch}
                disabled={searching || loading || !accessionNumber.trim() || !memberId.trim()}
              >
                {searching ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </Col>
          </Row>
          {(member || book) && (
            <div className="mt-3">
              <Button variant="outline-secondary" size="sm" onClick={handleClear}>
                Clear Search
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Member Details */}
      {member && (
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">👤 Member Details</h5>
          </Card.Header>
          <Card.Body>
            <Table bordered>
              <tbody>
                <tr>
                  <th style={{ width: '30%' }}>Member ID</th>
                  <td><strong className="text-primary">{member.memberId}</strong></td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{member.firstName} {member.surname || member.lastName}</td>
                </tr>
                <tr>
                  <th>Enrollment Number</th>
                  <td>{member.enrollment_number}</td>
                </tr>
                <tr>
                  <th>Course & Semester</th>
                  <td>{member.course} - Semester {member.semester}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>{member.mobile}</td>
                </tr>
                <tr>
                  <th>Card Status</th>
                  <td>
                    {member.cardStatus === 'active' ? (
                      <Badge bg="success">Active</Badge>
                    ) : (
                      <Badge bg="danger">Inactive</Badge>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Books Issued</th>
                  <td>
                    <Badge bg="warning" text="dark">
                      {member.issuedBooks?.length || 0} / {member.maxBooksAllowed || 3}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Book Details */}
      {book && (
        <Card className="mb-4">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">📚 Book Details</h5>
          </Card.Header>
          <Card.Body>
            <Table bordered>
              <tbody>
                <tr>
                  <th style={{ width: '30%' }}>Accession Number</th>
                  <td><strong className="text-success">{book.accession_number}</strong></td>
                </tr>
                <tr>
                  <th>Title</th>
                  <td><strong>{book.title}</strong></td>
                </tr>
                <tr>
                  <th>Author</th>
                  <td>{book.author_name}</td>
                </tr>
                <tr>
                  <th>Publisher</th>
                  <td>{book.publication}</td>
                </tr>
                <tr>
                  <th>Edition</th>
                  <td>{book.edition}</td>
                </tr>
                <tr>
                  <th>Availability Status</th>
                  <td>
                    {book.availabilityStatus === 'available' ? (
                      <Badge bg="success">Available</Badge>
                    ) : book.availabilityStatus === 'issued' ? (
                      <Badge bg="warning" text="dark">Issued</Badge>
                    ) : (
                      <Badge bg="danger">Lost</Badge>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Transaction Actions */}
      {transactionType && (
        <Card>
          <Card.Body>
            {transactionType === 'issue' && (
              <div className="text-center">
                <h5 className="text-success mb-3">✅ Book Available for Issue</h5>
                <p className="text-muted mb-4">
                  Click below to issue this book to the member
                </p>
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleIssueBook}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Issuing...
                    </>
                  ) : (
                    "Issue Book"
                  )}
                </Button>
              </div>
            )}

            {transactionType === 'return' && (
              <div className="text-center">
                <h5 className="text-warning mb-3">📖 Book Issued to This Member</h5>
                <p className="text-muted mb-4">
                  Click below to return this book
                </p>
                <Button
                  variant="warning"
                  size="lg"
                  onClick={handleReturnBook}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Returning...
                    </>
                  ) : (
                    "Return Book"
                  )}
                </Button>
              </div>
            )}

            {transactionType === 'already_issued' && (
              <div className="text-center">
                <h5 className="text-danger mb-3">❌ Book Already Issued</h5>
                <p className="text-muted">
                  This book is currently issued to another member
                </p>
              </div>
            )}

            {transactionType === 'limit_reached' && (
              <div className="text-center">
                <h5 className="text-danger mb-3">⚠️ Book Limit Reached</h5>
                <p className="text-muted">
                  Member has reached maximum book limit. Please return a book first.
                </p>
              </div>
            )}

            {transactionType === 'unavailable' && (
              <div className="text-center">
                <h5 className="text-danger mb-3">❌ Book Unavailable</h5>
                <p className="text-muted">
                  This book is currently not available
                </p>
              </div>
            )}

            {transactionType === 'issued_success' && (
              <div className="text-center">
                <h5 className="text-success mb-3">✅ Book Issued Successfully!</h5>
                <Alert variant="success">
                  <p className="mb-0">
                    <strong>Issue Date:</strong> {new Date(transaction?.issueDate).toLocaleDateString()}
                    <br />
                    <strong>Due Date:</strong> {new Date(transaction?.dueDate).toLocaleDateString()}
                  </p>
                </Alert>
                <Button variant="primary" onClick={handleClear}>
                  New Transaction
                </Button>
              </div>
            )}

            {transactionType === 'returned_success' && (
              <div className="text-center">
                <h5 className="text-success mb-3">✅ Book Returned Successfully!</h5>
                <Alert variant="success">
                  <p className="mb-0">
                    <strong>Return Date:</strong> {new Date().toLocaleDateString()}
                  </p>
                </Alert>
                <Button variant="primary" onClick={handleClear}>
                  New Transaction
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Initial State */}
      {!member && !book && !searching && !error && (
        <Alert variant="light" className="text-center">
          <h5>🔍 Enter Book and Member Details</h5>
          <p className="mb-0">
            Scan or enter the accession number and member ID to start a transaction
          </p>
        </Alert>
      )}
    </div>
  );
}