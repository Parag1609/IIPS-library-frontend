import { Link } from "react-router-dom";

export default function CatalogueUploadCSV() {
  return (
    <div className="page">
      <h1>Upload CSV (Catalogue)</h1>
      <p>Here you can upload CSV files for catalogue.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}
