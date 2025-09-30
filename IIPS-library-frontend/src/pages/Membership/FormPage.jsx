import { Link } from "react-router-dom";

export default function FormPage() {
  return (
    <div className="page">
      <h1>Form Page</h1>
      <p>Here you can fill the membership form.</p>
      <Link to="/addmembershiprequest"><button>⬅ Back</button></Link>
    </div>
  );
}
