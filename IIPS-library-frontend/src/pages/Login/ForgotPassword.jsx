import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      toast.success(response.message);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
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
      const response = await authService.resetPassword(
        email,
        formData.code,
        formData.newPassword
      );
      toast.success(response.message + ' Redirecting to login...');
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4 fw-bold">Reset</h2>

          {step === 1 ? (
            <form onSubmit={handleSendCode}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
                <div className="form-text">
                  We'll send a verification code to this email
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="alert alert-info" role="alert">
                <small>A 6-digit code has been sent to <strong>{email}</strong></small>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Verification Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="form-control"
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">New Password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="form-control"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-link w-100 mt-2"
              >
                Resend Code
              </button>
            </form>
          )}

          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none">
              <i className="bi bi-arrow-left me-1"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;