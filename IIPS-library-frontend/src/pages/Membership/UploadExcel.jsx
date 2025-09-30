import { Link } from "react-router-dom";

export default function UploadExcel() {
  return (
    <div className="page">
      <h1>Upload Excel</h1>
      <p>Here you can upload Excel files for membership.</p>
      <Link to="/addmembershiprequest"><button>⬅ Back</button></Link>
    </div>
  );
}
