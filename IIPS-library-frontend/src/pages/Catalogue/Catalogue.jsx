import { Link } from "react-router-dom";

export default function Catalogue() {
  return (
    <div className="home">
      <div className="header">
        <h1>Catalogue</h1>
      </div>
      <div className="menu">
        <Link to="/catalogue/uploadcsv"><button>Upload CSV</button></Link>
        <Link to="/catalogue/form"><button>Form</button></Link>
        <Link to="/catalogue/downloadbarcodes"><button>Download Barcodes</button></Link>
        <Link to="/catalogue/booklist"><button>List of Books</button></Link>
        <Link to="/"><button>⬅ Back</button></Link>
      </div>
    </div>
  );
}
