import { Link } from "react-router-dom";

export default function AddMembershipRequest() {
  return (
    <div className="home">
      <div className="header">
        <h1>Add Membership Request</h1>
      </div>
      <div className="menu">
        <Link to="/uploadcsv"><button>Upload CSV</button></Link>
        <Link to="/uploadexcel"><button>Upload Excel</button></Link>
        <Link to="/form"><button>Form</button></Link>
        <Link to="/membership"><button>⬅ Back</button></Link>
      </div>
    </div>
  );
}
