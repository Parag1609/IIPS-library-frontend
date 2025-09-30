import { Link } from "react-router-dom";

export default function NewMember() {
  return (
    <div className="page">
      <h1>New Member</h1>
      <p>Here you can add a new member.</p>
      <Link to="/membership"><button>⬅ Back</button></Link>
    </div>
  );
}
