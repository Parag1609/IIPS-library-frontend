import { Link } from "react-router-dom";

export default function Membership() {
  return (
    <div className="home">
      <div className="header">
        <h1>Membership</h1>
      </div>

      <div className="menu">
        <Link to="/membership/add-request">
          <button>Add Membership Request</button>
        </Link>
        <Link to="/membership/requests">
          <button>View Membership Requests</button>
        </Link>
        <Link to="/membership/new">
          <button>New Member</button>
        </Link>
        <Link to="/membership/approved-members">
          <button>View Approved Members</button>
        </Link>
        <Link to="/membership/search">
          <button>Search Member</button>
        </Link>
        <Link to="/">
          <button>⬅ Back to Home</button>
        </Link>
      </div>
    </div>
  );
}
