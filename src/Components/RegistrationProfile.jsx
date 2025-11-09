'use client'

import { useState } from "react";
import { Form, Button, Card, Container, Row, Col, InputGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { registerUserWithType } from "@/Redux/Authentication/AuthenticationAction";

export default function RegistrationProfile() {
  const [parentData, setParentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleRoute = () => {
    router.push("/");
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentData({ ...parentData, [name]: value });
  };

  const handleParentSubmit = (e) => {
    e.preventDefault();

    if (parentData.password !== parentData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Show OTP form after initial validation
    setOtpSent(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    // Prepare payload for backend
    const payload = {
      firstName: parentData.firstName,
      lastName: parentData.lastName,
      email: parentData.email,
      phoneNumber: parentData.phone,
      password: parentData.password,
      role: "ADMIN", // hardcoded for now
    };

    // console.log("Payload to send:", payload);

    dispatch(registerUserWithType(payload));
    handleRoute(); // redirect after dispatch
  };

  return (
    <Container className="my-5 d-flex justify-content-center">
      <div style={{ maxWidth: "500px", width: "100%" }}>
        {!otpSent ? (
          // Parent Registration Form
          <Card className="mb-4 shadow" style={{ borderRadius: '1rem', border: '2px solid #FFD700' }}>
            <Card.Header className="bg-dark text-warning fw-bold fs-5 text-center">
              Parent / Guardian Registration
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleParentSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="parentFirstName">
                      <Form.Label className="text-dark">First Name*</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        value={parentData.firstName}
                        onChange={handleParentChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="parentLastName">
                      <Form.Label className="text-dark">Last Name*</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        value={parentData.lastName}
                        onChange={handleParentChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="parentEmail">
                      <Form.Label className="text-dark">Email*</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={parentData.email}
                        onChange={handleParentChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="parentPhone">
                      <Form.Label className="text-dark">Phone Number*</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Phone Number"
                        name="phone"
                        value={parentData.phone}
                        onChange={handleParentChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="parentPassword">
                      <Form.Label className="text-dark">Password*</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          name="password"
                          value={parentData.password}
                          onChange={handleParentChange}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="parentConfirmPassword">
                      <Form.Label className="text-dark">Confirm Password*</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          value={parentData.confirmPassword}
                          onChange={handleParentChange}
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeSlash /> : <Eye />}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" className="w-100 btn-warning text-dark fw-bold">
                  Send OTP
                </Button>
              </Form>
            </Card.Body>
          </Card>
        ) : (
          // OTP Verification Form
          <Card className="mb-4 shadow" style={{ borderRadius: '1rem', border: '2px solid #FFD700' }}>
            <Card.Header className="bg-dark text-warning fw-bold fs-5 text-center">
              Enter OTP
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleOtpSubmit}>
                <Form.Group controlId="otp">
                  <Form.Label className="text-dark">Enter the OTP sent to your email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100 btn-warning text-dark fw-bold mt-3">
                  Verify OTP
                </Button>
              </Form>
            </Card.Body>
          </Card>
        )}
      </div>
    </Container>
  );
}
