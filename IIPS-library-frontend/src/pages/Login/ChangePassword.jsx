import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.changePassword(
        formData.currentPassword,
        formData.newPassword
      );
      toast.success(response.message);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <button 
                  onClick={() => navigate(-1)} 
                  className="btn btn-link text-decoration-none p-0 me-3"
                >
                  <i className="bi bi-arrow-left fs-4"></i>
                </button>
                <h2 className="card-title mb-0 fw-bold">Change Password</h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter new password"
                    required
                  />
                  <div className="form-text">
                    Must be at least 6 characters long
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-100 py-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;