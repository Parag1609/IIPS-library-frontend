import { Link } from "react-router-dom";

export default function CatalogueDownloadBarcodes() {
  return (
    <div className="page">
      <h1>Download Barcodes</h1>
      <p>Here you can download barcodes for books.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}
