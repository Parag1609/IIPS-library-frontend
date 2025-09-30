import { Link } from "react-router-dom";

export default function CatalogueForm() {
  return (
    <div className="page">
      <h1>Catalogue Form</h1>
      <p>Here you can manually add books via form.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}
