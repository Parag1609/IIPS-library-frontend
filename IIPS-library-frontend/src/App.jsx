import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// ✅ Import Pages
import Home from "./pages/Home/Home";

// Membership Pages
import Membership from "./pages/Membership/Membership";
import AddMembershipRequest from "./pages/Membership/AddMembershipRequest";
import UploadCSV from "./pages/Membership/UploadCSV";
import UploadExcel from "./pages/Membership/UploadExcel";
import FormPage from "./pages/Membership/FormPage";
import NewMember from "./pages/Membership/NewMember";
import SearchMember from "./pages/Membership/SearchMember";
import MemberDetails from "./pages/Membership/MemberDetails";
import MembershipRequestsTable from "./pages/Membership/MembershipRequestsTable";
// Catalogue Pages
import Catalogue from "./pages/Catalogue/Catalogue";
import CatalogueUploadCSV from "./pages/Catalogue/CatalogueUploadCSV";
import CatalogueUploadExcel from "./pages/Catalogue/CatalogueUploadExcel";
import CatalogueForm from "./pages/Catalogue/CatalogueForm";
import CatalogueDownloadBarcodes from "./pages/Catalogue/CatalogueDownloadBarcodes";
import BookList from "./pages/Catalogue/BookList";

// Transaction + Search Book
import Transaction from "./pages/Transaction/Transaction";
import SearchBook from "./pages/Search Book/SearchBook";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Membership */}
        <Route path="/membership" element={<Membership />} />
        <Route path="/membership/add-request" element={<AddMembershipRequest />} />
        <Route path="/membership/uploadcsv" element={<UploadCSV />} />
        <Route path="/membership/uploadexcel" element={<UploadExcel />} />
        <Route path="/membership/form" element={<FormPage />} />
        <Route path="/membership/new" element={<NewMember />} />
        <Route path="/membership/search" element={<SearchMember />} />
        <Route path="/membership/details/:name" element={<MemberDetails />} />
        <Route path="/membership/requests" element={<MembershipRequestsTable />} />

        {/* Catalogue */}
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/catalogue/uploadcsv" element={<CatalogueUploadCSV />} />
        <Route path="/catalogue/uploadexcel" element={<CatalogueUploadExcel />} />
        <Route path="/catalogue/form" element={<CatalogueForm />} />
        <Route path="/catalogue/downloadbarcodes" element={<CatalogueDownloadBarcodes />} />
        <Route path="/catalogue/booklist" element={<BookList />} />

        {/* Transaction + Search Book */}
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/search" element={<SearchBook />} />
      </Routes>
    </Router>
  );
}
