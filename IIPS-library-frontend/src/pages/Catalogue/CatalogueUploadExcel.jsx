import { Link } from "react-router-dom";

export default function CatalogueUploadExcel() {
  return (
    <div className="page">
      <h1>Upload Excel (Catalogue)</h1>
      <p>Here you can upload Excel files for catalogue.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}
