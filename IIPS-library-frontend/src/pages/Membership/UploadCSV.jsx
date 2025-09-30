import { Link } from "react-router-dom";

export default function UploadCSV() {
  return (
    <div className="page">
      <h1>Upload CSV</h1>
      <p>Here you can upload CSV files for membership.</p>
      <Link to="/addmembershiprequest"><button>⬅ Back</button></Link>
    </div>
  );
}
