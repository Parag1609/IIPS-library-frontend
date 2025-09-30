import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import SearchMember from "./pages/SearchMember";
import MemberDetails from "./pages/MemberDetails";
import Transaction from "./pages/Transaction";  
import SearchBook from "./pages/SearchBook";

//Home Page
function Home() {
  return (
    <div className="home">
      <div className="header">
        <h1>Welcome to IIPS Library</h1>
      </div>

      <div className="menu">
        <Link to="/membership"><button>Membership</button></Link>
        <Link to="/transaction"><button>Transaction</button></Link>
        <Link to="/catalogue"><button>Catalogue</button></Link>
        <Link to="/search"><button>Search Book</button></Link>
      </div>
    </div>
  );
}

//Membership Page
function Membership() {
  return (
    <div className="home">
      <div className="header">
        <h1>Membership</h1>
      </div>

      <div className="menu">
        <Link to="/addmembershiprequest"><button>Add Membership Request</button></Link>
        <Link to="/viewmembershiprequest"><button>View Membership Request</button></Link>
        <Link to="/approvedmemberlist"><button>Approved Member List</button></Link>
        <Link to="/searchmember"><button>Search Member</button></Link>
        <Link to="/downloadcards"><button>Download Cards</button></Link>
        <Link to="/"><button>⬅ Back to Home</button></Link>
      </div>
    </div>
  );
}


// ✅ Add Membership Request Page
function AddMembershipRequest() {
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

// ✅ Upload CSV Page
function UploadCSV() {
  return (
    <div className="page">
      <h1>Upload CSV Page</h1>
      <p>Here you can upload CSV file for membership.</p>
      <Link to="/addmembershiprequest"><button>⬅ Back</button></Link>
    </div>
  );
}

// ✅ Upload Excel Page
function UploadExcel() {
  return (
    <div className="page">
      <h1>Upload Excel Page</h1>
      <p>Here you can upload Excel file for membership.</p>
      <Link to="/addmembershiprequest"><button>⬅ Back</button></Link>
    </div>
  );
}

// ✅ Form Page
function FormPage() {
  return (
    <div className="page">
      <h1>Form Page</h1>
      <p>Here you can fill membership form.</p>
      <Link to="/addmembershiprequest"><button>⬅ Back</button></Link>
    </div>
  );
}

//New Member Page
function NewMember() {
  return (
    <div className="page">
      <h1>New Member Page</h1>
      <p>Here you can add a new member form.</p>
      <Link to="/membership"><button>⬅ Back</button></Link>
    </div>
  );
}

//Catalogue Page
function Catalogue() {
  return (
    <div className="home">
      <div className="header">
        <h1>Catalogue</h1>
      </div>

      <div className="menu">
        <Link to="/catalogue/uploadcsv"><button>Upload CSV</button></Link>
        <Link to="/catalogue/uploadexcel"><button>Upload Excel</button></Link>
        <Link to="/catalogue/form"><button>Form</button></Link>
        <Link to="/catalogue/downloadbarcodes"><button>Download Barcodes</button></Link>
        <Link to="/catalogue/booklist"><button>List of Books</button></Link>
        <Link to="/"><button>⬅ Back</button></Link>
      </div>
    </div>
  );
}

function CatalogueUploadCSV() {
  return (
    <div className="page">
      <h1>Upload CSV (Catalogue)</h1>
      <p>Here you can upload CSV files for catalogue.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}

function CatalogueUploadExcel() {
  return (
    <div className="page">
      <h1>Upload Excel (Catalogue)</h1>
      <p>Here you can upload Excel files for catalogue.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}

function CatalogueForm() {
  return (
    <div className="page">
      <h1>Catalogue Form</h1>
      <p>Here you can manually add books via form.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}

function CatalogueDownloadBarcodes() {
  return (
    <div className="page">
      <h1>Download Barcodes</h1>
      <p>Here you can download barcodes for books.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}

function BookList() {
  return (
    <div className="page">
      <h1>List of Books</h1>
      <p>Here you can view list of books.</p>
      <Link to="/catalogue"><button>⬅ Back</button></Link>
    </div>
  );
}



//Main Router
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/newmember" element={<NewMember />} />
        <Route path="/searchmember" element={<SearchMember />} />
        <Route path="/search-member" element={<SearchMember />} />
        <Route path="/member/:name" element={<MemberDetails />} />
        <Route path="/transaction" element={<Transaction />} /> 
        <Route path="/addmembershiprequest" element={<AddMembershipRequest />} />
        <Route path="/uploadcsv" element={<UploadCSV />} />
        <Route path="/uploadexcel" element={<UploadExcel />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/catalogue/uploadcsv" element={<CatalogueUploadCSV />} />
        <Route path="/catalogue/uploadexcel" element={<CatalogueUploadExcel />} />
        <Route path="/catalogue/form" element={<CatalogueForm />} />
        <Route path="/catalogue/downloadbarcodes" element={<CatalogueDownloadBarcodes />} />
        <Route path="/catalogue/booklist" element={<BookList />} />
        <Route path="/search" element={<SearchBook />} />
      </Routes>
    </Router>
  );
}
