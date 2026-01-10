"use client";
import { useEffect, useState } from "react";
import { Modal, Button, Form, Alert, Container, Row, Col, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from "react-redux";
import AdminLayout from "../../../adminlayouts";

export default function Settings() {
  const loginData = useSelector(state => state.auth.loginData);
  
  // Profile form state
  const [email, setEmail] = useState("");
  
  // Password reset states (using forgot password flow from Header)
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  // OTP states
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [otpIsLoading, setOtpIsLoading] = useState(false);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Load user data on mount
  useEffect(() => {
    if (loginData) {
      setEmail(loginData.email || "");
    }
  }, [loginData]);

  // OTP resend timer
  useEffect(() => {
    if (showOTPVerification && !canResendOTP && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResendOTP(true);
    }
  }, [showOTPVerification, canResendOTP, resendTimer]);

  // API call helper
  const apiCall = async (url, method, data) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(loginData?.token && { 'Authorization': `Bearer ${loginData.token}` })
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    return result;
  };

  // Handle password reset - send OTP (using forgot password flow)
  const handlePasswordResetSendOTP = async () => {
    setIsPasswordLoading(true);
    setPasswordError("");
    
    try {
      await apiCall('/forgot-password/send-otp', 'POST', {
        email: loginData.email
      });
      
      setShowPasswordReset(false);
      setShowOTPVerification(true);
      setResendTimer(60);
      setCanResendOTP(false);
      setOtpSuccess("Password reset OTP sent to " + loginData.email);
      
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOTP = [...otpCode];
    newOTP[index] = value;
    setOtpCode(newOTP);
    
    if (value && index < 5) {
      document.getElementById(`settings-otp-${index + 1}`)?.focus();
    }
  };

  // Handle OTP backspace
  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`settings-otp-${index - 1}`)?.focus();
    }
  };

  // Handle OTP verification
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setOtpIsLoading(true);
    setOtpError("");
    
    const otpString = otpCode.join("");
    if (otpString.length !== 6) {
      setOtpError("Please enter complete 6-digit OTP");
      setOtpIsLoading(false);
      return;
    }
    
    try {
      await apiCall('/forgot-password/verify-otp', 'POST', {
        email: loginData.email,
        otpCode: otpString
      });
      
      setShowOTPVerification(false);
      setShowPasswordReset(true);
      setOtpSuccess("");
      
    } catch (error) {
      setOtpError(error.message);
    } finally {
      setOtpIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsPasswordLoading(true);
    setPasswordError("");
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setIsPasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setIsPasswordLoading(false);
      return;
    }
    
    try {
      await apiCall('/forgot-password/reset', 'POST', {
        email: loginData.email,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        otpCode: otpCode.join("")
      });
      
      setShowPasswordReset(false);
      setPasswordSuccess("Password reset successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setOtpCode(["", "", "", "", "", ""]);
      
      setTimeout(() => setPasswordSuccess(""), 5000);
      
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    setOtpIsLoading(true);
    setOtpError("");
    
    try {
      await apiCall('/forgot-password/send-otp', 'POST', {
        email: loginData.email
      });
      
      setOtpSuccess("OTP resent successfully!");
      setResendTimer(60);
      setCanResendOTP(false);
      setOtpCode(["", "", "", "", "", ""]);
      
    } catch (error) {
      setOtpError(error.message);
    } finally {
      setOtpIsLoading(false);
    }
  };

  const handleCloseOTPModal = () => {
    setShowOTPVerification(false);
    setOtpCode(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpSuccess("");
  };

  const handleClosePasswordModal = () => {
    setShowPasswordReset(false);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  return (
    <AdminLayout>
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container className="py-3 py-md-5" style={{ maxWidth: '900px' }}>
        <Row>
          <Col>
            {/* Header */}
            <div className="mb-4 mb-md-5">
              <h2 className="fw-bold mb-2" style={{ color: '#ffc107', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
                <i className="bi bi-gear-fill me-2"></i>
                Settings
              </h2>
              <p className=" mb-0" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                Manage your account and security preferences
              </p>
            </div>

            {/* Profile Section */}
            <Card className="border-0 shadow-sm mb-3 mb-md-4" style={{ backgroundColor: '#1a1a1a', borderRadius: '12px' }}>
              <Card.Body className="p-3 p-md-4">
                <h4 className="fw-bold mb-2" style={{ color: '#ffc107', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                  <i className="bi bi-person-circle me-2"></i>
                  Profile
                </h4>
                <p className="mb-4" style={{ color: '#9e9e9e', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                  Your account information
                </p>

                <Form.Group className="mb-0">
                  <Form.Label className="fw-semibold" style={{ color: '#ffc107', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    disabled
                    style={{ 
                      borderRadius: '8px', 
                      padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #3a3a3a',
                      color: '#9e9e9e',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                    }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* Security Section */}
            <Card className="border-0 shadow-sm" style={{ backgroundColor: '#1a1a1a', borderRadius: '12px' }}>
              <Card.Body className="p-3 p-md-4">
                <h4 className="fw-bold mb-2" style={{ color: '#ffc107', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                  <i className="bi bi-shield-lock-fill me-2"></i>
                  Security
                </h4>
                <p className="mb-4" style={{ color: '#9e9e9e', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                  Manage your password and account security
                </p>

                {passwordSuccess && (
                  <Alert 
                    variant="success" 
                    dismissible 
                    onClose={() => setPasswordSuccess("")}
                    style={{ 
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                      border: '1px solid rgba(255, 193, 7, 0.3)',
                      color: '#ffc107',
                      borderRadius: '8px'
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    {passwordSuccess}
                  </Alert>
                )}

                {passwordError && (
                  <Alert 
                    variant="danger" 
                    dismissible 
                    onClose={() => setPasswordError("")}
                    style={{ 
                      backgroundColor: 'rgba(220, 53, 69, 0.1)',
                      border: '1px solid rgba(220, 53, 69, 0.3)',
                      color: '#dc3545',
                      borderRadius: '8px'
                    }}
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {passwordError}
                  </Alert>
                )}

                <div 
                  className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center p-3 border rounded gap-3"
                  style={{ 
                    borderRadius: '8px',
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #3a3a3a !important'
                  }}
                >
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-semibold" style={{ color: '#ffc107', fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}>
                      Password
                    </h6>
                    <p className="mb-0" style={{ color: '#9e9e9e', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                      Change your password to keep your account secure
                    </p>
                  </div>
                  <Button
                    onClick={handlePasswordResetSendOTP}
                    disabled={isPasswordLoading}
                    className="w-100 w-md-auto"
                    style={{ 
                      backgroundColor: isPasswordLoading ? '#6c757d' : '#ffc107',
                      color: '#000',
                      border: 'none', 
                      borderRadius: '8px',
                      padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
                      fontWeight: '600',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isPasswordLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* OTP Verification Modal */}
      <Modal 
        show={showOTPVerification} 
        onHide={handleCloseOTPModal} 
        centered
        className="settings-modal"
      >
        <div style={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '12px' }}>
          <Modal.Header className="border-0 text-center pb-0" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-100">
              <div className="w-100 text-end" onClick={handleCloseOTPModal} style={{ cursor: 'pointer' }}>
                <i className="bi bi-x-circle fs-4" style={{ color: '#ffc107' }}></i>
              </div>
              <div className="mb-3">
                <i className="bi bi-shield-check" style={{ fontSize: 'clamp(2.5rem, 6vw, 3rem)', color: '#ffc107' }}></i>
              </div>
              <Modal.Title className="fw-bold mb-2" style={{ color: '#ffc107', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                Enter Verification Code
              </Modal.Title>
              <p className="text-muted small mb-0" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                We've sent a 6-digit code to {loginData?.email}
              </p>
            </div>
          </Modal.Header>
          
          <Form onSubmit={handleOTPVerification}>
            <Modal.Body className="px-3 px-md-4 py-3" style={{ backgroundColor: '#1a1a1a' }}>
              {otpError && (
                <Alert 
                  variant="danger" 
                  className="mb-3"
                  style={{ 
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    color: '#dc3545',
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                  }}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {otpError}
                </Alert>
              )}

              {otpSuccess && (
                <Alert 
                  variant="success" 
                  className="mb-3"
                  style={{ 
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    color: '#ffc107',
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {otpSuccess}
                </Alert>
              )}

              <div className="mb-4">
                <div className="d-flex justify-content-center gap-2 mb-3 flex-wrap">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`settings-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      className="form-control text-center fw-bold"
                      style={{
                        width: 'clamp(40px, 10vw, 45px)',
                        height: 'clamp(48px, 12vw, 55px)',
                        fontSize: 'clamp(18px, 4vw, 22px)',
                        border: digit ? '2px solid #ffc107' : '2px solid #3a3a3a',
                        borderRadius: '10px',
                        backgroundColor: digit ? '#2a2a2a' : '#1a1a1a',
                        color: '#ffc107',
                        fontWeight: '600'
                      }}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      disabled={otpIsLoading}
                      autoComplete="off"
                    />
                  ))}
                </div>
                <p className="text-center text-muted small mb-0" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Code expires in 5 minutes
                </p>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
                <Button
                  type="button"
                  className="flex-fill py-2 py-md-3 fw-semibold"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #ffc107',
                    color: '#ffc107',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                  }}
                  onClick={handleResendOTP}
                  disabled={otpIsLoading || !canResendOTP}
                >
                  Resend
                </Button>
                <Button
                  type="submit"
                  className="flex-fill py-2 py-md-3 fw-semibold"
                  style={{ 
                    backgroundColor: otpIsLoading ? '#6c757d' : '#ffc107',
                    color: '#000',
                    border: 'none', 
                    borderRadius: '8px',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                  }}
                  disabled={otpIsLoading}
                >
                  {otpIsLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Verifying...
                    </>
                  ) : (
                    "Confirm Code"
                  )}
                </Button>
              </div>

              <div className="text-center">
                {!canResendOTP && (
                  <span className="text-muted small" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                    Resend available in {resendTimer}s
                  </span>
                )}
                {canResendOTP && (
                  <span className="text-muted small" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                    Didn't receive the code? Click Resend above
                  </span>
                )}
              </div>
            </Modal.Body>
          </Form>
        </div>
      </Modal>

      {/* Password Reset Modal */}
      <Modal 
        show={showPasswordReset} 
        onHide={handleClosePasswordModal} 
        centered
        className="settings-modal"
      >
        <div style={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '12px' }}>
          <Modal.Header className="border-0 text-center pb-0" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-100">
              <div className="w-100 text-end" onClick={handleClosePasswordModal} style={{ cursor: 'pointer' }}>
                <i className="bi bi-x-circle fs-4" style={{ color: '#ffc107' }}></i>
              </div>
              <div className="mb-3">
                <i className="bi bi-lock-fill" style={{ fontSize: 'clamp(2.5rem, 6vw, 3rem)', color: '#ffc107' }}></i>
              </div>
              <Modal.Title className="fw-bold mb-2" style={{ color: '#ffc107', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                Create New Password
              </Modal.Title>
              <p className="text-muted small mb-0" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                Enter your new password below
              </p>
            </div>
          </Modal.Header>
          
          <Form onSubmit={handlePasswordReset}>
            <Modal.Body className="px-3 px-md-4 py-3" style={{ backgroundColor: '#1a1a1a' }}>
              {passwordError && (
                <Alert 
                  variant="danger" 
                  className="mb-3"
                  style={{ 
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    color: '#dc3545',
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                  }}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {passwordError}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <div className="position-relative">
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    required
                    minLength={8}
                    className="py-2 py-md-3 px-3 pe-5"
                    style={{ 
                      border: '2px solid #ffc107',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      backgroundColor: '#2a2a2a',
                      color: '#fff'
                    }}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isPasswordLoading}
                  />
                  <button 
                    type="button" 
                    className="btn position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isPasswordLoading}
                    style={{ color: '#ffc107' }}
                  >
                    {showNewPassword ? (
                      <i className="bi bi-eye-fill"></i>
                    ) : (
                      <i className="bi bi-eye-slash-fill"></i>
                    )}
                  </button>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="position-relative">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    required
                    minLength={8}
                    className="py-2 py-md-3 px-3 pe-5"
                    style={{ 
                      border: '1px solid #3a3a3a',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                      backgroundColor: '#2a2a2a',
                      color: '#fff'
                    }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isPasswordLoading}
                  />
                  <button 
                    type="button" 
                    className="btn position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isPasswordLoading}
                    style={{ color: '#ffc107' }}
                  >
                    {showConfirmPassword ? (
                      <i className="bi bi-eye-fill"></i>
                    ) : (
                      <i className="bi bi-eye-slash-fill"></i>
                    )}
                  </button>
                </div>
                <small className="text-muted" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                  Password must be at least 8 characters long
                </small>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 py-2 py-md-3 fw-semibold d-flex align-items-center justify-content-center"
                style={{ 
                  backgroundColor: isPasswordLoading ? '#6c757d' : '#ffc107',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                }}
                disabled={isPasswordLoading}
              >
                {isPasswordLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </Modal.Body>
          </Form>
        </div>
      </Modal>

      <style jsx global>{`
        .settings-modal .modal-content {
          background-color: #1a1a1a !important;
          border: 1px solid #3a3a3a;
          border-radius: 12px;
        }

        .settings-modal .modal-header {
          border-bottom: none !important;
        }

        .settings-modal .form-control:focus {
          background-color: #2a2a2a;
          border-color: #ffc107;
          color: #fff;
          box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
        }

        .settings-modal .form-control::placeholder {
          color: #6c757d;
        }

        @media (max-width: 576px) {
          .settings-modal .modal-dialog {
            margin: 0.5rem;
          }
        }
      `}</style>
    </div>
    </AdminLayout>
  );
}