// HelpSection.jsx
"use client";
import { useState } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";

export default function HelpSection({ show, onHide }) {
  const [activeView, setActiveView] = useState(null); // null, 'raise', 'status', 'success'
  const [requestType, setRequestType] = useState("registration");
  
  // Raise Request Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [serviceTicketId, setServiceTicketId] = useState(null);
  
  // Request Status State
  const [searchRequestId, setSearchRequestId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  const handleRaiseRequestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
  
    try {
      // Correct field names matching RegistrationServiceRequestDTO
      const requestData = {
        requesttype: requestType,
        firstname: firstName,
        lastname: lastName,
        email: email,
        phonenumber: phoneNumber,
        message: message || "",
        timestamp: new Date().toISOString()
      };
  
      // console.log("=== SUBMITTING REQUEST ===");
      // console.log("Request Data:", requestData);
  
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/service-request/raise-register-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      // console.log("Response Status:", response.status);
  
      if (!response.ok) {
        const errorText = await response.text();
        // console.error("Error Response:", errorText);
        throw new Error('Failed to submit request. Please try again.');
      }
  
      const responseText = await response.text();
      // console.log("Success Response:", responseText);
  
      // Extract service ticket ID from response text
      const ticketId = responseText.match(/\d+/)?.[0];
  
      if (ticketId) {
        setServiceTicketId(ticketId);
        setActiveView('success');
      } else {
        throw new Error('Failed to get service ticket ID');
      }
  
    } catch (error) {
      // console.error("Submit Error:", error);
      setSubmitError(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleSearchRequest = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError("");
    setSearchResult(null);
    
    try {
      // console.log("=== SEARCHING REQUEST STATUS ===");
      // console.log("Ticket ID:", searchRequestId);
      
      // Call your backend API
      const response = await fetch(`${API_BASE_URL}/service-request/get-service-ticket-status/${searchRequestId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // console.log("Search Response Status:", response.status);
      
      if (!response.ok) {
        throw new Error('Request not found. Please check your ticket ID.');
      }
      
      const data = await response.json();
      //console.log("Search Result:", data);
      setSearchResult(data);
      
    } catch (error) {
      // console.error("Search Error:", error);
      setSearchError(error.message || "Failed to fetch request status. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const resetRaiseRequestForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setMessage("");
    setRequestType("registration");
    setServiceTicketId(null);
  };

  const handleClose = () => {
    setActiveView(null);
    setSearchResult(null);
    setSearchRequestId("");
    setSearchError("");
    setSubmitError("");
    resetRaiseRequestForm();
    onHide();
  };

  const handleBackToRaise = () => {
    resetRaiseRequestForm();
    setActiveView('raise');
  };

  return (
    <>
      {/* Main Help Menu Modal */}
      <Modal show={show && !activeView} onHide={handleClose} centered>
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="w-100 text-end" onClick={handleClose} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </div>
            <div className="mb-3">
              <i className="bi bi-question-circle-fill" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Help Center</Modal.Title>
            <p className="text-muted small mb-0">How can we assist you today?</p>
          </div>
        </Modal.Header>
        
        <Modal.Body className="px-4 py-4">
          <div className="d-grid gap-3">
            <Button
              variant="outline-primary"
              className="py-3 d-flex align-items-center justify-content-between"
              style={{ borderRadius: '10px', fontSize: '16px' }}
              onClick={() => setActiveView('raise')}
            >
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-plus-circle-fill fs-4"></i>
                <div className="text-start">
                  <div className="fw-semibold">Raise a Request</div>
                  <small className="text-muted">Submit a new support request</small>
                </div>
              </div>
              <i className="bi bi-chevron-right"></i>
            </Button>

            <Button
              variant="outline-success"
              className="py-3 d-flex align-items-center justify-content-between"
              style={{ borderRadius: '10px', fontSize: '16px' }}
              onClick={() => setActiveView('status')}
            >
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-search fs-4"></i>
                <div className="text-start">
                  <div className="fw-semibold">Request Status</div>
                  <small className="text-muted">Track your existing requests</small>
                </div>
              </div>
              <i className="bi bi-chevron-right"></i>
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Raise Request Modal */}
      <Modal show={show && activeView === 'raise'} onHide={handleClose} centered size="lg">
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button 
                variant="link" 
                className="text-decoration-none p-0"
                onClick={() => setActiveView(null)}
              >
                <i className="bi bi-arrow-left fs-5"></i>
              </Button>
              <div onClick={handleClose} style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </div>
            </div>
            <div className="mb-3">
              <i className="bi bi-pencil-square" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Raise a Request</Modal.Title>
            <p className="text-muted small mb-0">Fill in the details and we'll get back to you soon.</p>
          </div>
        </Modal.Header>
        
        <Form onSubmit={handleRaiseRequestSubmit}>
          <Modal.Body className="px-4 py-3">
            {submitError && (
              <Alert variant="danger" className="mb-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {submitError}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Request Type</Form.Label>
              <Form.Select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="py-2 px-3"
                style={{ border: '2px solid #0d6efd', borderRadius: '8px', fontSize: '16px' }}
                disabled={isSubmitting}
              >
                <option value="registration">Registration Request</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    required
                    className="py-2 px-3"
                    style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    required
                    className="py-2 px-3"
                    style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                required
                className="py-2 px-3"
                style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                required
                className="py-2 px-3"
                style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isSubmitting}
              />
            </Form.Group>

            {requestType === "other" && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Describe your request..."
                  required
                  className="py-2 px-3"
                  style={{ border: '1px solid #dee2e6', borderRadius: '8px', fontSize: '16px' }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                />
              </Form.Group>
            )}

            <Button
              type="submit"
              className="w-100 py-3 fw-semibold text-white d-flex align-items-center justify-content-center"
              style={{ backgroundColor: isSubmitting ? '#6c757d' : '#0d6efd', border: 'none', borderRadius: '8px', fontSize: '16px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </Modal.Body>
        </Form>
      </Modal>

      {/* Success Modal */}
      <Modal show={show && activeView === 'success'} onHide={handleClose} centered>
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="w-100 text-end" onClick={handleClose} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
              </svg>
            </div>
            <div className="mb-3">
              <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem', color: '#28a745' }}></i>
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Request Submitted Successfully!</Modal.Title>
          </div>
        </Modal.Header>
        
        <Modal.Body className="px-4 py-3 text-center">
          <div className="mb-4 p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', border: '2px solid #28a745' }}>
            <p className="text-muted mb-2">Your Service Ticket ID</p>
            <h2 className="fw-bold text-dark mb-0" style={{ fontSize: '2rem', letterSpacing: '2px' }}>
              {serviceTicketId}
            </h2>
          </div>

          <Alert variant="info" className="text-start">
            <div className="d-flex align-items-start">
              <i className="bi bi-envelope-fill me-3 mt-1" style={{ fontSize: '1.5rem' }}></i>
              <div>
                <p className="mb-2 fw-semibold">Please check your email!</p>
                <p className="mb-0 small">We've sent a confirmation email to <strong>{email}</strong> with your service ticket details and next steps.</p>
              </div>
            </div>
          </Alert>

          <div className="text-muted small mb-4">
            <p className="mb-2">
              <i className="bi bi-info-circle me-2"></i>
              Save this ticket ID to track your request status.
            </p>
          </div>

          <div className="d-grid gap-2">
            <Button
              variant="success"
              className="py-2"
              onClick={() => {
                setActiveView('status');
                setSearchRequestId(serviceTicketId);
              }}
            >
              <i className="bi bi-search me-2"></i>
              Track This Request
            </Button>
            
            <Button
              variant="outline-primary"
              className="py-2"
              onClick={handleBackToRaise}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Submit Another Request
            </Button>
            
            <Button
              variant="outline-secondary"
              className="py-2"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Request Status Modal */}
      <Modal show={show && activeView === 'status'} onHide={handleClose} centered size="lg">
        <Modal.Header className="border-0 text-center pb-0">
          <div className="w-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button 
                variant="link" 
                className="text-decoration-none p-0"
                onClick={() => setActiveView(null)}
              >
                <i className="bi bi-arrow-left fs-5"></i>
              </Button>
              <div onClick={handleClose} style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </div>
            </div>
            <div className="mb-3">
              <i className="bi bi-clipboard-check" style={{ fontSize: '3rem', color: '#28a745' }}></i>
            </div>
            <Modal.Title className="fw-bold text-dark fs-3 mb-2">Request Status</Modal.Title>
            <p className="text-muted small mb-0">Enter your service ticket ID to check the status.</p>
          </div>
        </Modal.Header>
        
        <Modal.Body className="px-4 py-3">
          {searchError && (
            <Alert variant="danger" className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {searchError}
            </Alert>
          )}

          <Form onSubmit={handleSearchRequest}>
            <Form.Group className="mb-3">
              <div className="input-group" style={{ height: '50px' }}>
                <Form.Control
                  type="text"
                  placeholder="Enter Service Ticket ID (e.g., 12345)"
                  required
                  className="py-2 px-3"
                  style={{ border: '2px solid #28a745', borderRadius: '8px 0 0 8px', fontSize: '16px', height: '100%' }}
                  value={searchRequestId}
                  onChange={(e) => setSearchRequestId(e.target.value)}
                  disabled={isSearching}
                />
                <Button
                  type="submit"
                  style={{ 
                    backgroundColor: isSearching ? '#6c757d' : '#28a745', 
                    border: 'none', 
                    borderRadius: '0 8px 8px 0',
                    height: '100%',
                    minWidth: '100px'
                  }}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Search
                    </>
                  )}
                </Button>
              </div>
            </Form.Group>
          </Form>

          {searchResult && (
            <div className="mt-4 p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #dee2e6' }}>
              <h5 className="fw-bold mb-3 text-dark">Request Details</h5>
              
              <Row className="mb-2">
                <Col xs={5} className="text-muted">Ticket ID:</Col>
                <Col xs={7} className="fw-semibold">{searchResult.id}</Col>
              </Row>
              
              <Row className="mb-2">
                <Col xs={5} className="text-muted">Request Type:</Col>
                <Col xs={7} className="fw-semibold text-capitalize">{searchResult.requestType}</Col>
              </Row>
              
              <Row className="mb-2">
                <Col xs={5} className="text-muted">Status:</Col>
                <Col xs={7}>
                  <span className={`badge ${
                    searchResult.status === 'PENDING' ? 'bg-warning text-dark' :
                    searchResult.status === 'APPROVED' || searchResult.status === 'COMPLETED' ? 'bg-success' :
                    searchResult.status === 'REJECTED' ? 'bg-danger' :
                    searchResult.status === 'IN_PROGRESS' ? 'bg-info' :
                    'bg-secondary'
                  }`}>
                    {searchResult.status}
                  </span>
                </Col>
              </Row>
              
              <Row className="mb-2">
                <Col xs={5} className="text-muted">Name:</Col>
                <Col xs={7} className="fw-semibold">{searchResult.firstName} {searchResult.lastName}</Col>
              </Row>
              
              <Row className="mb-2">
                <Col xs={5} className="text-muted">Email:</Col>
                <Col xs={7} className="fw-semibold">{searchResult.email}</Col>
              </Row>
              
              <Row className="mb-2">
                <Col xs={5} className="text-muted">Phone:</Col>
                <Col xs={7} className="fw-semibold">{searchResult.phoneNumber}</Col>
              </Row>

              {searchResult.message && (
                <Row className="mb-2">
                  <Col xs={5} className="text-muted">Message:</Col>
                  <Col xs={7} className="fw-semibold">{searchResult.message}</Col>
                </Row>
              )}
              
              {searchResult.createdAt && (
                <Row className="mb-2">
                  <Col xs={5} className="text-muted">Submitted:</Col>
                  <Col xs={7} className="fw-semibold">{new Date(searchResult.createdAt).toLocaleDateString()}</Col>
                </Row>
              )}
              
              {searchResult.updatedAt && (
                <Row>
                  <Col xs={5} className="text-muted">Last Updated:</Col>
                  <Col xs={7} className="fw-semibold">{new Date(searchResult.updatedAt).toLocaleDateString()}</Col>
                </Row>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}