import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

// ✅ Import Pages
import Home from "./pages/Home/Home";

// Membership Pages
import Membership from "./pages/Membership/Membership";
import AddMembershipRequest from "./pages/Membership/AddMembershipRequest";
import UploadCSV from "./pages/Membership/UploadCSV";
import UploadExcel from "./pages/Membership/UploadExcel";
import FormPage from "./pages/Membership/FormPage";
import AddMember from "./pages/Membership/AddMember";
import SearchMember from "./pages/Membership/SearchMember";
import MemberDetails from "./pages/Membership/MemberDetails";
import MembershipRequestsTable from "./pages/Membership/MembershipRequestsTable";
import ApprovedMemberList from "./pages/Membership/ApprovedMemberList";
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
import Login from './pages/Login/Login';
import ForgotPassword from './pages/Login/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import ChangePassword from './pages/Login/ChangePassword';

/*
export default function App() {
  return (<>
    <Router>
      <Routes>
        //Home 
        <Route path="/" element={<Home />} />

        // Membership 
        <Route path="/membership" element={<Membership />} />
        <Route path="/membership/add-request" element={<AddMembershipRequest />} />
        <Route path="/membership/uploadcsv" element={<UploadCSV />} />
        <Route path="/membership/uploadexcel" element={<UploadExcel />} />
        <Route path="/membership/form" element={<FormPage />} />
        <Route path="/membership/new" element={<AddMember />} />
        <Route path="/membership/search" element={<SearchMember />} />
        <Route path="/membership/details/:memberId" element={<MemberDetails />} />
        <Route path="/membership/requests" element={<MembershipRequestsTable />} />
        <Route path="/membership/approved-members" element={< ApprovedMemberList/>} />

        // Catalogue 
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/catalogue/uploadcsv" element={<CatalogueUploadCSV />} />
        <Route path="/catalogue/uploadexcel" element={<CatalogueUploadExcel />} />
        <Route path="/catalogue/form" element={<CatalogueForm />} />
        <Route path="/catalogue/downloadbarcodes" element={<CatalogueDownloadBarcodes />} />
        <Route path="/catalogue/booklist" element={<BookList />} />

        //Transaction + Search Book 
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/search" element={<SearchBook />} />
      </Routes>
    </Router>
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> </>
  );
}
  */
 export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          {/* Login & Password Reset */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Public Search Book Page - No Auth Required */}
          <Route path="/search" element={<SearchBook />} />

          {/* ========== PROTECTED ROUTES ========== */}
          {/* Home */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* Change Password - Protected */}
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />

          {/* Membership - All Protected */}
          <Route 
            path="/membership" 
            element={
              <ProtectedRoute>
                <Membership />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membership/add-request" 
            element={
              <ProtectedRoute>
                <AddMembershipRequest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membership/uploadcsv" 
            element={
              <ProtectedRoute>
                <UploadCSV />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membership/uploadexcel" 
            element={
              <ProtectedRoute>
                <UploadExcel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membership/form" 
            element={
              <ProtectedRoute>
                <FormPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membership/new" 
            element={
              <ProtectedRoute>
                <AddMember />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membership/search" 
            element={
              <ProtectedRoute>
                <SearchMember />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membership/details/:memberId" 
            element={
              <ProtectedRoute>
                <MemberDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membership/requests" 
            element={
              <ProtectedRoute>
                <MembershipRequestsTable />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/membership/approved-members" 
            element={
              <ProtectedRoute>
                <ApprovedMemberList />
              </ProtectedRoute>
            } 
          />

          {/* Catalogue - All Protected */}
          <Route 
            path="/catalogue" 
            element={
              <ProtectedRoute>
                <Catalogue />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/catalogue/uploadcsv" 
            element={
              <ProtectedRoute>
                <CatalogueUploadCSV />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/catalogue/uploadexcel" 
            element={
              <ProtectedRoute>
                <CatalogueUploadExcel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/catalogue/form" 
            element={
              <ProtectedRoute>
                <CatalogueForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/catalogue/downloadbarcodes" 
            element={
              <ProtectedRoute>
                <CatalogueDownloadBarcodes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/catalogue/booklist" 
            element={
              <ProtectedRoute>
                <BookList />
              </ProtectedRoute>
            } 
          />

          {/* Transaction - Protected */}
          <Route 
            path="/transaction" 
            element={
              <ProtectedRoute>
                <Transaction />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
