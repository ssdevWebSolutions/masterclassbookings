"use client";
import { useState, useEffect } from "react";
import { Table, Button, Badge, Form, InputGroup, Spinner, Alert, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const ServiceRequest = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  // Fetch all service requests - silent error handling
  const fetchServiceRequests = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/service-request/get-service-tickets/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Fetch failed with status:', response.status);
        setError("Unable to load service requests. Please try again.");
        setServiceRequests([]);
        setFilteredRequests([]);
        return;
      }

      const data = await response.json();
      
      // Validate data is an array
      if (!Array.isArray(data)) {
        console.warn("Expected array but received:", data);
        setServiceRequests([]);
        setFilteredRequests([]);
        return;
      }

      console.log("Fetched Service Requests:", data);
      setServiceRequests(data);
      setFilteredRequests(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("Unable to connect to server. Please check your connection.");
      setServiceRequests([]);
      setFilteredRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  // Filter requests with null-safe checks
  useEffect(() => {
    let filtered = [...serviceRequests];

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(req => req?.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(req => {
        const firstName = req?.firstName?.toLowerCase() || "";
        const lastName = req?.lastName?.toLowerCase() || "";
        const email = req?.email?.toLowerCase() || "";
        const phoneNumber = req?.phoneNumber || "";
        const id = req?.id?.toString() || "";
        
        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          email.includes(query) ||
          phoneNumber.includes(query) ||
          id.includes(query)
        );
      });
    }

    setFilteredRequests(filtered);
  }, [statusFilter, searchQuery, serviceRequests]);

  // Auto-hide messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error && !isLoading) {
      const timer = setTimeout(() => setError(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [error, isLoading]);

  // Handle approve action
  const handleApprove = (request) => {
    if (!request || !request.id) {
      console.error("Invalid request selected");
      return;
    }
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!selectedRequest?.id) {
      console.error("No request selected");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/service-request/approve-service-register-ticket/${selectedRequest.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Approve failed with status:', response.status);
        setError("Failed to approve request. Please try again.");
        return;
      }

      const result = await response.text().catch(() => "Approved successfully");
      console.log("Approve Response:", result);
      
      setSuccessMessage(
        `Request #${selectedRequest.id} approved successfully! User account created and email sent.`
      );
      
      setShowApproveModal(false);
      setSelectedRequest(null);
      
      // Refresh the list
      await fetchServiceRequests();
      
    } catch (error) {
      console.error("Approve Error:", error);
      setError("Unable to approve request. Please check your connection and try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject action
  const handleReject = (request) => {
    if (!request || !request.id) {
      console.error("Invalid request selected");
      return;
    }
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedRequest?.id) {
      console.error("No request selected");
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccessMessage("");
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/service-request/reject-service-register-ticket/${selectedRequest.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Reject failed with status:', response.status);
        setError("Failed to reject request. Please try again.");
        return;
      }

      const result = await response.text().catch(() => "Rejected successfully");
      console.log("Reject Response:", result);
      
      setSuccessMessage(`Request #${selectedRequest.id} has been rejected successfully.`);
      
      setShowRejectModal(false);
      setSelectedRequest(null);
      
      // Refresh the list
      await fetchServiceRequests();
      
    } catch (error) {
      console.error("Reject Error:", error);
      setError("Unable to reject request. Please check your connection and try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (!status) return <Badge bg="secondary">Unknown</Badge>;
    
    const badges = {
      PENDING: <Badge bg="warning" text="dark">Pending</Badge>,
      APPROVED: <Badge bg="success">Approved</Badge>,
      REJECTED: <Badge bg="danger">Rejected</Badge>,
      IN_PROGRESS: <Badge bg="info">In Progress</Badge>,
      COMPLETED: <Badge bg="primary">Completed</Badge>
    };
    return badges[status] || <Badge bg="secondary">{status}</Badge>;
  };

  // Safe date formatter
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      console.error("Date parsing error:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#000000', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold mb-2" style={{ color: '#FFD700' }}>
            <i className="bi bi-ticket-detailed-fill me-2"></i>
            Service Requests Management
          </h2>
          <p className="text-light mb-0">Manage and review all service registration tickets</p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert 
            variant="success" 
            className="mb-4"
            dismissible 
            onClose={() => setSuccessMessage("")}
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {successMessage}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert 
            variant="danger" 
            className="mb-4"
            dismissible 
            onClose={() => setError("")}
          >
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        {/* Filters and Search */}
        <div className="card mb-4" style={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}>
          <div className="card-body">
            <div className="row g-3">
              {/* Search Bar */}
              <div className="col-md-6">
                <Form.Label className="fw-semibold" style={{ color: '#FFD700' }}>Search</Form.Label>
                <InputGroup>
                  <InputGroup.Text style={{ backgroundColor: '#FFD700', border: 'none' }}>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, phone, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      backgroundColor: '#2a2a2a', 
                      color: '#ffffff', 
                      border: '1px solid #FFD700',
                      borderLeft: 'none'
                    }}
                  />
                </InputGroup>
              </div>

              {/* Status Filter */}
              <div className="col-md-6">
                <Form.Label className="fw-semibold" style={{ color: '#FFD700' }}>Filter by Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ 
                    backgroundColor: '#2a2a2a', 
                    color: '#ffffff', 
                    border: '1px solid #FFD700'
                  }}
                >
                  <option value="ALL">All Requests</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </Form.Select>
              </div>
            </div>

            {/* Stats */}
            <div className="row mt-3">
              <div className="col">
                <small style={{ color: '#FFD700' }}>
                  Showing {filteredRequests.length} of {serviceRequests.length} requests
                </small>
              </div>
              <div className="col text-end">
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={fetchServiceRequests}
                  disabled={isLoading}
                  style={{ borderColor: '#FFD700', color: '#FFD700' }}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: '#FFD700' }} />
            <p className="mt-3 text-light">Loading service requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="card" style={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}>
            <div className="card-body text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#FFD700' }}></i>
              <p className="mt-3 mb-0 text-light">
                {searchQuery || statusFilter !== "ALL" ? "No matching requests found" : "No service requests available"}
              </p>
              {(searchQuery || statusFilter !== "ALL") && (
                <Button 
                  variant="outline-light"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                  style={{ borderColor: '#FFD700', color: '#FFD700' }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Requests Table */
          <div className="card" style={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}>
            <div className="table-responsive">
              <Table hover className="mb-0" style={{ color: '#ffffff' }}>
                <thead style={{ backgroundColor: '#FFD700', color: '#000000' }}>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} style={{ backgroundColor: '#2a2a2a' }}>
                      <td className="fw-bold" style={{ color: '#FFD700' }}>#{request.id || 'N/A'}</td>
                      <td>{`${request.firstName || ''} ${request.lastName || ''}`.trim() || 'N/A'}</td>
                      <td>{request.email || 'N/A'}</td>
                      <td>{request.phoneNumber || 'N/A'}</td>
                      <td className="text-capitalize">{request.requestType || 'N/A'}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>{formatDate(request.timestamp)}</td>
                      <td>
                        {request.status === 'PENDING' ? (
                          <div className="d-flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(request)}
                              disabled={actionLoading}
                              style={{ 
                                backgroundColor: '#28a745', 
                                border: 'none',
                                fontSize: '0.875rem'
                              }}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Approve
                            </Button>
                            {/* <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => handleReject(request)}
                              disabled={actionLoading}
                              style={{ fontSize: '0.875rem' }}
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Reject
                            </Button> */}
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline-light"
                            style={{ borderColor: '#FFD700', color: '#FFD700', fontSize: '0.875rem' }}
                          >
                            <i className="bi bi-eye me-1"></i>
                            closed
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        <Modal 
          show={showApproveModal} 
          onHide={() => !actionLoading && setShowApproveModal(false)} 
          centered
          backdrop={actionLoading ? 'static' : true}
          keyboard={!actionLoading}
        >
          <Modal.Header closeButton={!actionLoading} style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #FFD700' }}>
            <Modal.Title style={{ color: '#FFD700' }}>
              <i className="bi bi-check-circle me-2"></i>
              Approve Request
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            <p>Are you sure you want to approve this service request?</p>
            <p className="small text-warning mb-3">
              <i className="bi bi-info-circle me-1"></i>
              This will create a user account and send an approval email with default password.
            </p>
            {selectedRequest && (
              <div className="mt-3 p-3" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #FFD700' }}>
                <p className="mb-2"><strong style={{ color: '#FFD700' }}>ID:</strong> #{selectedRequest.id}</p>
                <p className="mb-2"><strong style={{ color: '#FFD700' }}>Name:</strong> {selectedRequest.firstName} {selectedRequest.lastName}</p>
                <p className="mb-0"><strong style={{ color: '#FFD700' }}>Email:</strong> {selectedRequest.email}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid #FFD700' }}>
            <Button 
              variant="outline-light" 
              onClick={() => setShowApproveModal(false)}
              disabled={actionLoading}
              style={{ borderColor: '#FFD700', color: '#FFD700' }}
            >
              Cancel
            </Button>
            <Button 
              style={{ backgroundColor: '#28a745', border: 'none' }}
              onClick={confirmApprove}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Approving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Approve
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Reject Confirmation Modal */}
        <Modal 
          show={showRejectModal} 
          onHide={() => !actionLoading && setShowRejectModal(false)} 
          centered
          backdrop={actionLoading ? 'static' : true}
          keyboard={!actionLoading}
        >
          <Modal.Header closeButton={!actionLoading} style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #FFD700' }}>
            <Modal.Title style={{ color: '#FFD700' }}>
              <i className="bi bi-x-circle me-2"></i>
              Reject Request
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            <p>Are you sure you want to reject this service request?</p>
            <p className="small text-danger mb-3">
              <i className="bi bi-exclamation-triangle me-1"></i>
              This action will update the request status. The user will be notified of the rejection.
            </p>
            {selectedRequest && (
              <div className="mt-3 p-3" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #dc3545' }}>
                <p className="mb-2"><strong style={{ color: '#FFD700' }}>ID:</strong> #{selectedRequest.id}</p>
                <p className="mb-2"><strong style={{ color: '#FFD700' }}>Name:</strong> {selectedRequest.firstName} {selectedRequest.lastName}</p>
                <p className="mb-0"><strong style={{ color: '#FFD700' }}>Email:</strong> {selectedRequest.email}</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid #FFD700' }}>
            <Button 
              variant="outline-light" 
              onClick={() => setShowRejectModal(false)}
              disabled={actionLoading}
              style={{ borderColor: '#FFD700', color: '#FFD700' }}
            >
              Cancel
            </Button>
            {/* <Button 
              variant="danger"
              onClick={confirmReject}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Rejecting...
                </>
              ) : (
                <>
                  <i className="bi bi-x-circle me-2"></i>
                  Reject
                </>
              )}
            </Button> */}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ServiceRequest;