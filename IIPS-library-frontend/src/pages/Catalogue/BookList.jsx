import { Link } from "react-router-dom";

export default function BookList() {
  return (
    <div className="page">
      <h1>List of Books</h1>
      <p>Here you can view list of books.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}
