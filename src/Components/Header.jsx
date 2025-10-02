"use client";
import { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Form, Alert, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from "react-redux";
import { loginUserWithType, logOutUserWithType } from "../Redux/Authentication/AuthenticationAction";
import { fetchKids } from "@/Redux/Kids/KidActions";
import { persistor } from "@/store";
import { useRouter } from "next/router";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Registration form state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regPhoneNumber, setRegPhoneNumber] = useState("");
  const [regError, setRegError] = useState("");
  const [regIsLoading, setRegIsLoading] = useState(false);
  
  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotIsLoading, setForgotIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // OTP states
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpType, setOtpType] = useState(""); // "registration" or "forgot_password"
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpIsLoading, setOtpIsLoading] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState("");
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  
  // Password reset step
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  
  const dispatch = useDispatch();
  const loginData = useSelector(state => state.auth.loginData);
  const loginStatus = useSelector(state => state.auth);
  
  const isLoggedIn = loginData && loginData.token && loginData.token !== null && loginData.token !== "";

  // Watch for changes in login data
  useEffect(() => {
    if (loginData && loginData.token && loginData.token !== null && loginData.token !== "") {
      dispatch(fetchKids(loginData.id, loginData.token));
      setShowLogin(false);
      setLoginError("");
      setEmail("");
      setPassword("");
      setIsLoading(false);
    } else if (loginData && loginData.error) {
      setLoginError("Login failed. Please try again.");
      setIsLoading(false);
    } else if (loginStatus && loginStatus.error) {
      setLoginError("Login failed. Please try again.");
      setIsLoading(false);
    } else if (loginStatus && loginStatus.loading === false && isLoading) {
      if (!loginData || !loginData.token) {
        setLoginError("Login failed. Please check your credentials and try again.");
        setIsLoading(false);
      }
    }
  }, [loginData, loginStatus, isLoading, dispatch]);

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

  // Clear errors when modals open
  useEffect(() => {
    if (showLogin) setLoginError("");
    if (showRegister) setRegError("");
    if (showForgotPassword) setForgotError("");
    if (showOTPVerification) setOtpError("");
  }, [showLogin, showRegister, showForgotPassword, showOTPVerification]);

  // API call functions
  const apiCall = async (url, method, data) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    return result;
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    
    const loginPayload = {
      email: email.trim(),
      password: password
    };
    
    dispatch(loginUserWithType(loginPayload));
  };

  // Handle registration OTP send
  const handleRegisterSendOTP = async (e) => {
    e.preventDefault();
    setRegIsLoading(true);
    setRegError("");
    
    try {
      await apiCall('/register/send-otp', 'POST', {
        email: regEmail.trim(),
        firstName: regFirstName.trim()
      });
      
      setShowRegister(false);
      setShowOTPVerification(true);
      setOtpType("registration");
      setResendTimer(60);
      setCanResendOTP(false);
      setOtpSuccess("OTP sent successfully to " + regEmail);
      
    } catch (error) {
      setRegError(error.message);
    } finally {
      setRegIsLoading(false);
    }
  };

  // Handle forgot password OTP send
  const handleForgotPasswordSendOTP = async (e) => {
    e.preventDefault();
    setForgotIsLoading(true);
    setForgotError("");
    
    try {
      await apiCall('/forgot-password/send-otp', 'POST', {
        email: forgotEmail.trim()
      });
      
      setShowForgotPassword(false);
      setShowOTPVerification(true);
      setOtpType("forgot_password");
      setResendTimer(60);
      setCanResendOTP(false);
      setOtpSuccess("Password reset OTP sent to " + forgotEmail);
      
    } catch (error) {
      setForgotError(error.message);
    } finally {
      setForgotIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOTP = [...otpCode];
    newOTP[index] = value;
    setOtpCode(newOTP);
    
    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Handle OTP backspace
  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
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
      if (otpType === "registration") {
        // Complete registration
        await apiCall('/register/verify', 'POST', {
          email: regEmail,
          password: regPassword,
          firstName: regFirstName,
          lastName: regLastName,
          phoneNumber: regPhoneNumber,
          otpCode: otpString
        });
        
        setShowOTPVerification(false);
        setShowLogin(true);
        setOtpSuccess("");
        resetRegistrationForm();
        alert("Registration completed successfully! Please login with your credentials.");
        
      } else if (otpType === "forgot_password") {
        // Verify OTP for password reset
        await apiCall('/forgot-password/verify-otp', 'POST', {
          email: forgotEmail,
          otpCode: otpString
        });
        
        setShowOTPVerification(false);
        setShowPasswordReset(true);
        setOtpSuccess("");
      }
      
    } catch (error) {
      setOtpError(error.message);
    } finally {
      setOtpIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setForgotIsLoading(true);
    setForgotError("");
    
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match");
      setForgotIsLoading(false);
      return;
    }
    
    try {
      await apiCall('/forgot-password/reset', 'POST', {
        email: forgotEmail,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        otpCode: otpCode.join("")
      });
      
      setShowPasswordReset(false);
      setShowLogin(true);
      resetForgotPasswordForm();
      alert("Password reset successfully! Please login with your new password.");
      
    } catch (error) {
      setForgotError(error.message);
    } finally {
      setForgotIsLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    setOtpIsLoading(true);
    setOtpError("");
    
    try {
      if (otpType === "registration") {
        await apiCall('/register/send-otp', 'POST', {
          email: regEmail.trim(),
          firstName: regFirstName.trim()
        });
      } else if (otpType === "forgot_password") {
        await apiCall('/forgot-password/send-otp', 'POST', {
          email: forgotEmail.trim()
        });
      }
      
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

  // Reset form functions
  const resetRegistrationForm = () => {
    setRegEmail("");
    setRegPassword("");
    setRegFirstName("");
    setRegLastName("");
    setRegPhoneNumber("");
    setRegError("");
    setOtpCode(["", "", "", "", "", ""]);
  };

  const resetForgotPasswordForm = () => {
    setForgotEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setForgotError("");
    setOtpCode(["", "", "", "", "", ""]);
  };

  const router =useRouter();
  const handleLogOut = () => {
    
    dispatch(logOutUserWithType());
    router.push("/");
    setEmail("");
    setPassword("");
    setLoginError("");
  };

  const handleModalClose = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgotPassword(false);
    setShowOTPVerification(false);
    setShowPasswordReset(false);
    setLoginError("");
    setRegError("");
    setForgotError("");
    setOtpError("");
    setOtpSuccess("");
    setIsLoading(false);
    setRegIsLoading(false);
    setForgotIsLoading(false);
    setOtpIsLoading(false);
  };

  return (
    <header className="sticky-top  text-white shadow-sm" style={{backgroundColor:'black'}}>
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* Logo + Title */}
        <div className="d-flex align-items-center">
          <img 
            src="logo_.png" 
            alt="MasterClass Cricket Logo" 
            className="me-2 img-fluid" 
            style={{ maxHeight: "80px", width: "auto" }} 
          />
          {/* <h1 className="h5 fw-bold text-warning mb-0" style={{color:'#FFD700'}}>MasterClass Cricket</h1> */}
        </div>

        {/* Desktop Nav */}
        <nav className="d-none d-md-flex align-items-center gap-3">
          {!isLoggedIn ? (
            <Button 
              className="btn-warning text-dark fw-semibold" 
              onClick={() => setShowLogin(true)}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          ) : (
            <Dropdown>
              <Dropdown.Toggle 
                variant="warning" 
                className="text-dark fw-semibold d-flex align-items-center gap-2"
                style={{ border: 'none' }}
              >
                <i className="bi bi-person-circle fs-5"></i>
                <span>Profile</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="profile">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item href="bookings">
                  <i className="bi bi-calendar-check me-2"></i>
                  Bookings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogOut}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="btn btn-outline-light d-md-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="d-md-none bg-dark text-white p-3 d-flex flex-column gap-2">
          {!isLoggedIn ? (
            <Button 
              className="btn-warning text-dark fw-semibold" 
              onClick={() => setShowLogin(true)}
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          ) : (
            <Dropdown>
              <Dropdown.Toggle 
                variant="warning" 
                className="text-dark fw-semibold d-flex align-items-center gap-2"
                style={{ border: 'none' }}
              >
                <i className="bi bi-person-circle fs-5"></i>
                <span>Profile</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="profile">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item href="bookings">
                  <i className="bi bi-calendar-check me-2"></i>
                  Bookings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogOut}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      )}

      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleModalClose} centered className="koala-modal">
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="w-100 text-end" onClick={handleModalClose} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </div>
            <div className="mb-3">
              <img src="logo_.png" alt="Cricket App" className="login-logo" width="15%" height="15%" />
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Login Now</Modal.Title>
            <p className="text-muted small mb-0">Introduce your information to sign in.</p>
          </div>
        </Modal.Header>
        
        <Form onSubmit={handleLogin}>
          <Modal.Body className="px-4 py-3">
            {loginError && (
              <Alert variant="danger" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {loginError}
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
                className="koala-input py-3 px-3"
                style={{ border: '2px solid #ff6b35', borderRadius: '8px', fontSize: '16px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="*******"
                  required
                  className="koala-input py-3 px-3 pe-5"
                  style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  className="btn position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                    </svg>
                  )}
                </button>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <a 
                href="#" 
                className="text-muted text-decoration-none small"
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(false);
                  setShowForgotPassword(true);
                }}
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-100 py-3 fw-semibold text-white d-flex align-items-center justify-content-center"
              style={{ backgroundColor: isLoading ? '#6c757d' : '#000000', border: 'none', borderRadius: '8px', fontSize: '16px' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account? </span>
              <a 
                href="#" 
                className="text-decoration-none fw-semibold" 
                style={{ color: '#ff6b35' }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Register now
              </a>
            </div>
          </Modal.Body>
        </Form>
      </Modal>

      {/* Registration Modal */}
      <Modal show={showRegister} onHide={handleModalClose} centered size="lg">
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="w-100 text-end" onClick={handleModalClose} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </div>
            <div className="mb-3">
              <img src="logo_.png" alt="Cricket App" className="login-logo" width="10%" height="10%" />
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Create Account</Modal.Title>
            <p className="text-muted small mb-0">Join MasterClass Cricket Academy today!</p>
          </div>
        </Modal.Header>
        
        <Form onSubmit={handleRegisterSendOTP}>
          <Modal.Body className="px-4 py-3">
            {regError && (
              <Alert variant="danger" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {regError}
              </Alert>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    required
                    className="py-3 px-3"
                    style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    disabled={regIsLoading}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    required
                    className="py-3 px-3"
                    style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    disabled={regIsLoading}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email Address"
                required
                className="py-3 px-3"
                style={{ border: '2px solid #ff6b35', borderRadius: '8px', fontSize: '16px' }}
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                disabled={regIsLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                required
                className="py-3 px-3"
                style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                value={regPhoneNumber}
                onChange={(e) => setRegPhoneNumber(e.target.value)}
                disabled={regIsLoading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  minLength={8}
                  className="py-3 px-3 pe-5"
                  style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  disabled={regIsLoading}
                />
                <button 
                  type="button" 
                  className="btn position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={regIsLoading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <small className="text-muted">Password must be at least 8 characters long</small>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-3 fw-semibold text-white d-flex align-items-center justify-content-center"
              style={{ backgroundColor: regIsLoading ? '#6c757d' : '#ff6b35', border: 'none', borderRadius: '8px', fontSize: '16px' }}
              disabled={regIsLoading}
            >
              {regIsLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending OTP...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>

            <div className="text-center mt-4">
              <span className="text-muted">Already have an account? </span>
              <a 
                href="#" 
                className="text-decoration-none fw-semibold" 
                style={{ color: '#ff6b35' }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Login here
              </a>
            </div>
          </Modal.Body>
        </Form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal show={showForgotPassword} onHide={handleModalClose} centered>
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="w-100 text-end" onClick={handleModalClose} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </div>
            <div className="mb-3">
              <i className="bi bi-key-fill" style={{ fontSize: '3rem', color: '#ff6b35' }}></i>
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Reset Password</Modal.Title>
            <p className="text-muted small mb-0">Enter your email to receive a verification code.</p>
          </div>
        </Modal.Header>
        
        <Form onSubmit={handleForgotPasswordSendOTP}>
          <Modal.Body className="px-4 py-3">
            {forgotError && (
              <Alert variant="danger" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {forgotError}
              </Alert>
            )}

            <Form.Group className="mb-4">
              <Form.Control
                type="email"
                placeholder="Enter your email address"
                required
                className="py-3 px-3"
                style={{ border: '2px solid #ff6b35', borderRadius: '8px', fontSize: '16px' }}
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                disabled={forgotIsLoading}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-3 fw-semibold text-white d-flex align-items-center justify-content-center"
              style={{ backgroundColor: forgotIsLoading ? '#6c757d' : '#ff6b35', border: 'none', borderRadius: '8px', fontSize: '16px' }}
              disabled={forgotIsLoading}
            >
              {forgotIsLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending Code...
                </>
              ) : (
                "Send Verification Code"
              )}
            </Button>

            <div className="text-center mt-4">
              <span className="text-muted">Remember your password? </span>
              <a 
                href="#" 
                className="text-decoration-none fw-semibold" 
                style={{ color: '#ff6b35' }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(false);
                  setShowLogin(true);
                }}
              >
                Back to Login
              </a>
            </div>
          </Modal.Body>
        </Form>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal show={showOTPVerification} onHide={handleModalClose} centered>
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="w-100 text-end" onClick={handleModalClose} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </div>
            <div className="mb-3">
              <i className="bi bi-shield-check" style={{ fontSize: '3rem', color: '#28a745' }}></i>
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Enter Verification Code</Modal.Title>
            <p className="text-muted small mb-0">
              We've sent a 6-digit code to {otpType === "registration" ? regEmail : forgotEmail}
            </p>
          </div>
        </Modal.Header>
        
        <Form onSubmit={handleOTPVerification}>
          <Modal.Body className="px-4 py-3">
            {otpError && (
              <Alert variant="danger" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {otpError}
              </Alert>
            )}

            {otpSuccess && (
              <Alert variant="success" className="mb-3">
                <i className="bi bi-check-circle me-2"></i>
                {otpSuccess}
              </Alert>
            )}

            {/* Professional OTP Grid */}
            <div className="mb-4">
              <div className="d-flex justify-content-center gap-2 mb-3 flex-wrap">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    className="form-control text-center fw-bold"
                    style={{
                      width: '45px',
                      height: '55px',
                      fontSize: '22px',
                      border: digit ? '2px solid #28a745' : '2px solid #dee2e6',
                      borderRadius: '10px',
                      backgroundColor: digit ? '#f8f9fa' : '#ffffff',
                      color: '#000000',
                      fontWeight: '600',
                      flexShrink: 0
                    }}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    disabled={otpIsLoading}
                    autoComplete="off"
                  />
                ))}
              </div>
              <p className="text-center text-muted small mb-0">Code expires in 5 minutes</p>
            </div>

            <Button
              type="submit"
              className="w-100 py-3 fw-semibold text-white d-flex align-items-center justify-content-center mb-3"
              style={{ backgroundColor: otpIsLoading ? '#6c757d' : '#28a745', border: 'none', borderRadius: '8px', fontSize: '16px' }}
              disabled={otpIsLoading}
            >
              {otpIsLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <span className="text-muted small">Didn't receive the code? </span>
              {canResendOTP ? (
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none fw-semibold"
                  style={{ color: '#ff6b35', fontSize: '14px' }}
                  onClick={handleResendOTP}
                  disabled={otpIsLoading}
                >
                  Resend Code
                </button>
              ) : (
                <span className="text-muted small">
                  Resend in {resendTimer}s
                </span>
              )}
            </div>
          </Modal.Body>
        </Form>
      </Modal>

      {/* Password Reset Modal */}
      <Modal show={showPasswordReset} onHide={handleModalClose} centered>
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="w-100 text-end" onClick={handleModalClose} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </div>
            <div className="mb-3">
              <i className="bi bi-lock-fill" style={{ fontSize: '3rem', color: '#28a745' }}></i>
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Create New Password</Modal.Title>
            <p className="text-muted small mb-0">Enter your new password below.</p>
          </div>
        </Modal.Header>
        
        <Form onSubmit={handlePasswordReset}>
          <Modal.Body className="px-4 py-3">
            {forgotError && (
              <Alert variant="danger" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {forgotError}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  required
                  minLength={8}
                  className="py-3 px-3 pe-5"
                  style={{ border: '2px solid #28a745', borderRadius: '8px', fontSize: '16px' }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={forgotIsLoading}
                />
                <button 
                  type="button" 
                  className="btn position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={forgotIsLoading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
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
                  className="py-3 px-3 pe-5"
                  style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={forgotIsLoading}
                />
                <button 
                  type="button" 
                  className="btn position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={forgotIsLoading}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <small className="text-muted">Password must be at least 8 characters long</small>
            </Form.Group>

            <Button
              type="submit"
              className="w-100 py-3 fw-semibold text-white d-flex align-items-center justify-content-center"
              style={{ backgroundColor: forgotIsLoading ? '#6c757d' : '#28a745', border: 'none', borderRadius: '8px', fontSize: '16px' }}
              disabled={forgotIsLoading}
            >
              {forgotIsLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </Modal.Body>
        </Form>
      </Modal>
    </header>
  );
}