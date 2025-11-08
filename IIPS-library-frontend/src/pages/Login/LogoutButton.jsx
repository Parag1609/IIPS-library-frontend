import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (!admin) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold">
          <i className="bi bi-book me-2"></i>
          Library Management
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-2 fs-5"></i>
                <span>{admin.fullName}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link to="/change-password" className="dropdown-item">
                    <i className="bi bi-key me-2"></i>
                    Change Password
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button onClick={handleLogout} className="dropdown-item text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;