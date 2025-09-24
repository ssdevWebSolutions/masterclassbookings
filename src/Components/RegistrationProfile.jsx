"use client";
import { useState } from "react";
import { Form, Button, Card, Container, Row, Col, Accordion } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RegistrationProfile() {
  const [parentData, setParentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [kids, setKids] = useState([]);

  const [newKid, setNewKid] = useState({
    firstName: "",
    lastName: "",
    age: "",
    club: "",
    medicalInfo: "",
    level: ""
  });

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    setParentData({ ...parentData, [name]: value });
  };

  const handleKidChange = (e) => {
    const { name, value } = e.target;
    setNewKid({ ...newKid, [name]: value });
  };

  const addKid = () => {
    setKids([...kids, newKid]);
    setNewKid({
      firstName: "",
      lastName: "",
      age: "",
      club: "",
      medicalInfo: "",
      level: ""
    });
  };

  const handleParentSubmit = (e) => {
    e.preventDefault();
    console.log("Parent Data:", parentData);
  };

  const handleKidsSubmit = (e) => {
    e.preventDefault();
    console.log("Kids Data:", kids);
  };

  return (
    <Container className="my-5">
      {/* Parent Registration */}
      <Card className="mb-4 shadow" style={{ borderRadius: '1rem', border: '2px solid #FFD700' }}>
        <Card.Header className="bg-dark text-warning fw-bold fs-5 text-center">
          Parent / Guardian Registration
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleParentSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="parentFirstName">
                  <Form.Label className="text-dark">Parent/Guardian First Name*</Form.Label>
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
                  <Form.Label className="text-dark">Parent/Guardian Last Name*</Form.Label>
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

            <Button type="submit" className="w-100 btn-warning text-dark fw-bold">
              Register Parent
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Kids Profile Section */}
      <Card className="shadow" style={{ borderRadius: '1rem', border: '2px solid #FFD700' }}>
        <Card.Header className="bg-dark text-warning fw-bold fs-5 text-center">
          Kids Profile
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleKidsSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="kidFirstName">
                  <Form.Label className="text-dark">Player's First Name*</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={newKid.firstName}
                    onChange={handleKidChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="kidLastName">
                  <Form.Label className="text-dark">Player's Last Name*</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={newKid.lastName}
                    onChange={handleKidChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="kidAge">
                  <Form.Label className="text-dark">Player's Age*</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Age"
                    name="age"
                    value={newKid.age}
                    onChange={handleKidChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="kidClub">
                  <Form.Label className="text-dark">Player's Club*</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Club"
                    name="club"
                    value={newKid.club}
                    onChange={handleKidChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="kidLevel">
                  <Form.Label className="text-dark">Highest Level*</Form.Label>
                  <Form.Select
                    name="level"
                    value={newKid.level}
                    onChange={handleKidChange}
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="School">School</option>
                    <option value="Club">Club</option>
                    <option value="Borough/District">Borough/District</option>
                    <option value="Regional">Regional</option>
                    <option value="County">County</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="kidMedicalInfo">
              <Form.Label className="text-dark">Medical Info</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Medical Info"
                name="medicalInfo"
                value={newKid.medicalInfo}
                onChange={handleKidChange}
              />
            </Form.Group>

            <Button type="button" className="btn-warning text-dark fw-bold me-2" onClick={addKid}>
              Add Kid
            </Button>
            <Button type="submit" className="btn-dark text-warning fw-bold">
              Save Kids
            </Button>
          </Form>

          {/* Display added kids */}
          {kids.length > 0 && (
            <Accordion defaultActiveKey="0" className="mt-4">
              {kids.map((kid, idx) => (
                <Accordion.Item eventKey={idx.toString()} key={idx}>
                  <Accordion.Header>{kid.firstName} {kid.lastName}</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Age:</strong> {kid.age}</p>
                    <p><strong>Club:</strong> {kid.club}</p>
                    <p><strong>Highest Level:</strong> {kid.level}</p>
                    <p><strong>Medical Info:</strong> {kid.medicalInfo}</p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
