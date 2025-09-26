"use client";
import { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Form, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from "react-redux";
import { loginUserWithType, logOutUserWithType } from "../Redux/Authentication/AuthenticationAction";
import { fetchKids } from "@/Redux/Kids/KidActions";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("n");
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const loginData = useSelector(state => state.auth.loginData);
  const loginStatus = useSelector(state => state.auth); // Get full auth state for error handling
  
  // Computed property for logged in status based on token
  const isLoggedIn = loginData && loginData.token && loginData.token !== null && loginData.token !== "";

  // Watch for changes in login data
  useEffect(() => {
    console.log("Login data changed:", loginData);
    console.log("Login status changed:", loginStatus);
    
    if (loginData && loginData.token && loginData.token !== null && loginData.token !== "") {

      dispatch(fetchKids(loginData.id,loginData.token));
      // Successful login
      console.log("User successfully logged in");
      setShowLogin(false);
      setLoginError("");
      setEmail("");
      setPassword("");
      setIsLoading(false);
    } else if (loginData && loginData.error) {
      // Login failed with error from loginData
      console.log("Login failed:", loginData.error);
      setLoginError("Login failed. Please try again.");
      setIsLoading(false);
    } else if (loginStatus && loginStatus.error) {
      // Check for errors in auth state
      console.log("Auth error:", loginStatus.error);
      setLoginError("Login failed. Please try again.");
      setIsLoading(false);
    } else if (loginStatus && loginStatus.loading === false && isLoading) {
      // If loading finished but no token and no specific error
      if (!loginData || !loginData.token) {
        console.log("Login failed - no token received");
        setLoginError("Login failed. Please check your credentials and try again.");
        setIsLoading(false);
      }
    }
  }, [loginData, loginStatus, isLoading]);


  useEffect(()=>{
    console.log(loginError,"lgg");
  },[loginError]);

  // Clear error when modal opens
  useEffect(() => {
    if (showLogin) {
      setLoginError("");
    }
  }, [showLogin]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    
    const loginPayload = {
      email: email.trim(),
      password: password
    };
    
    console.log("Attempting login with:", { email: loginPayload.email });
    dispatch(loginUserWithType(loginPayload));
  };

  const handleLogOut = () => {
    console.log("Logging out user");
    dispatch(logOutUserWithType());
    // Clear any stored user data
    setEmail("");
    setPassword("");
    setLoginError("");
  };

  const handleModalClose = () => {
    setShowLogin(false);
    setLoginError("");
    setIsLoading(false);
    // Don't clear email/password to allow user to retry
  };

  return (
    <header className="sticky-top bg-dark text-white shadow-sm">
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* Logo + Title */}
        <div className="d-flex align-items-center">
          <img 
            src="logo_.png" 
            alt="MasterClass Cricket Logo" 
            className="me-2 img-fluid" 
            style={{ maxHeight: "50px", width: "auto" }} 
          />
          <h1 className="h5 fw-bold text-warning mb-0">MasterClass Cricket</h1>
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
                <Dropdown.Item href="#settings">
                  <i className="bi bi-gear me-2"></i>
                  Settings
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
          {/* <a href="#camps" className="text-white text-decoration-none"
             onMouseEnter={e => e.target.style.color = "#FFD700"}
             onMouseLeave={e => e.target.style.color = "white"}>
            Camps
          </a>
          <a href="#about" className="text-white text-decoration-none"
             onMouseEnter={e => e.target.style.color = "#FFD700"}
             onMouseLeave={e => e.target.style.color = "white"}>
            About
          </a>
          <a href="#contact" className="text-white text-decoration-none"
             onMouseEnter={e => e.target.style.color = "#FFD700"}
             onMouseLeave={e => e.target.style.color = "white"}>
            Contact
          </a> */}

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
                <Dropdown.Item href="#settings">
                  <i className="bi bi-gear me-2"></i>
                  Settings
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
            <div className="mb-3">
              <img src="logo_.png" alt="Cricket App" className="login-logo" width="15%" height="15%" />
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Login Now</Modal.Title>
            <p className="text-muted small mb-0">Introduce your information to sign in.</p>
          </div>
        </Modal.Header>
        
        <Form onSubmit={handleLogin}>
          <Modal.Body className="px-4 py-3">
            {/* Error Alert */}
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

            {/* Password field with eye toggle */}
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
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} text-muted`}></i>
                </button>
              </div>
            </Form.Group>

            <div className="text-start mb-4">
              <a href="#forgot" className="text-muted text-decoration-none small">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-100 py-3 fw-semibold text-white d-flex align-items-center justify-content-center"
              style={{ backgroundColor: isLoading ? '#6c757d' : '#9e9e9e', border: 'none', borderRadius: '8px', fontSize: '16px' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                "Continue"
              )}
            </Button>

            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account? </span>
              <a href="register" className="text-decoration-none fw-semibold" style={{ color: '#ff6b35' }}>
                Register now
              </a>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </header>
  );
}