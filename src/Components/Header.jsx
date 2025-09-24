"use client";
import { useState } from "react";
import { Modal, Button, Dropdown, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    setShowLogin(false);
  };

  const handleGoogleLogin = () => {
    alert("Google login clicked!");
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
    <a href="#camps" className="text-white text-decoration-none"
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
    </a>

    {!loggedIn ? (
      <Button className="btn-warning text-dark fw-semibold" onClick={() => setShowLogin(true)}>
        Login
      </Button>
    ) : (
      <Dropdown>
        <Dropdown.Toggle variant="warning" className="text-dark fw-semibold">
          <i className="bi bi-person-circle"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#profile">Profile</Dropdown.Item>
          <Dropdown.Item href="#bookings">Bookings</Dropdown.Item>
          <Dropdown.Item href="#settings">Settings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => setLoggedIn(false)}>Logout</Dropdown.Item>
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
          <a href="#camps" className="text-white text-decoration-none"
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
          </a>

          {!loggedIn ? (
            <Button className="btn-warning text-dark fw-semibold" onClick={() => setShowLogin(true)}>
              Login
            </Button>
          ) : (
            <Dropdown>
              <Dropdown.Toggle variant="warning" className="text-dark fw-semibold">
                <i className="bi bi-person-circle"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                <Dropdown.Item href="#bookings">Bookings</Dropdown.Item>
                <Dropdown.Item href="#settings">Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setLoggedIn(false)}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      )}

      {/* Login Modal */}
      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered className="koala-modal">
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="mb-3">
              <img src="logo_.png" alt="Cricket App" className="login-logo"  width="15%" height="15%"/>
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Login Now</Modal.Title>
            <p className="text-muted small mb-0">Introduce your information to sign in.</p>
          </div>
        </Modal.Header>
        
        <Form onSubmit={handleLogin}>
          <Modal.Body className="px-4 py-3">
            {/* <Button 
              variant="outline-secondary" 
              className="w-100 mb-4 py-2 d-flex align-items-center justify-content-center"
              onClick={handleGoogleLogin}
            >
              <img src="/google-icon.svg" alt="Google" className="me-2" width="20" height="20" />
              Login with Google
            </Button>

            <div className="text-center mb-4 position-relative">
              <span className="text-muted small px-2 bg-white position-relative z-2">Or</span>
              <hr className="mt-2" />
            </div> */}

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                required
                className="koala-input py-3 px-3"
                style={{ border: '2px solid #ff6b35', borderRadius: '8px', fontSize: '16px' }}
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
                />
                <button 
                  type="button" 
                  className="btn position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
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
              className="w-100 py-3 fw-semibold text-white"
              style={{ backgroundColor: '#9e9e9e', border: 'none', borderRadius: '8px', fontSize: '16px' }}
            >
              Continue
            </Button>

            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account? </span>
              <a href="#register" className="text-decoration-none fw-semibold" style={{ color: '#ff6b35' }}>
                Register now
              </a>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </header>
  );
}
