"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Container, Row, Col, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchKids, addKid, updateKid, deleteKid } from "../Redux/Kids/KidActions";
import { useRouter } from "next/router";

export default function RegistrationProfileKids() {
  const dispatch = useDispatch();
  const kidsList = useSelector(state => state.kids.list);
  const loginData = useSelector(state => state.auth.loginData);

  const [parentData, setParentData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [newKid, setNewKid] = useState({ firstName: "", lastName: "", age: "", club: "", medicalInfo: "", level: "" });
  const [editKidId, setEditKidId] = useState(null);
  const kidstate = useSelector(state => state.kids.list);
  const router = useRouter();

  useEffect(()=>{
    console.log(kidstate,"pp");
  },[kidstate]);

  useEffect(()=>{
    if(!loginData.token)
    {
      router.push("/");
    }
  },[loginData])

  useEffect(() => {
    if (loginData && loginData.token) {
      setParentData({
        firstName: loginData.fullName.split(" ")[0] || "",
        lastName: loginData.fullName.split(" ")[1] || "",
        email: loginData.email,
        phone: loginData.mobileNumber,
      });
      dispatch(fetchKids(loginData.id,loginData.token));
    }
  }, [loginData]);

  const handleKidChange = (e) => {
    const { name, value } = e.target;
    setNewKid({ ...newKid, [name]: value });
  };

  const handleAddOrUpdateKid = (e) => {
    e.preventDefault();
    if (editKidId) {
      dispatch(updateKid(editKidId, newKid ,loginData.token));
      setEditKidId(null);
    } else {
      console.log(loginData.id,"id");
      dispatch(addKid( loginData.id, newKid ,loginData.token));
    }
    setNewKid({ firstName:"", lastName:"", age:"", club:"", medicalInfo:"", level:"" });
  };

  const handleEditKid = (kid) => {
    setEditKidId(kid.id);
    setNewKid(kid);
  };

  const handleDeleteKid = (kidId) => {
    dispatch(deleteKid(kidId));
  };

  return (
    <>
      <Container className="my-5">
  
        {/* 🔙 Back Button */}
        <div className="mb-3">
          <Button 
            variant="outline-dark" 
            className="fw-bold"
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-left me-2"></i> Back
          </Button>
        </div>
  
        <Card className="shadow mb-4" style={{ borderRadius: '1rem', border: '2px solid #FFD700' }}>
          <Card.Header className="bg-dark text-warning fw-bold fs-5 text-center">Kids Profile</Card.Header>
          <Card.Body>
            <Form onSubmit={handleAddOrUpdateKid}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="kidFirstName">
                    <Form.Label>First Name*</Form.Label>
                    <Form.Control type="text" placeholder="First Name" name="firstName" value={newKid.firstName} onChange={handleKidChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="kidLastName">
                    <Form.Label>Last Name*</Form.Label>
                    <Form.Control type="text" placeholder="Last Name" name="lastName" value={newKid.lastName} onChange={handleKidChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="kidAge">
                    <Form.Label>Age*</Form.Label>
                    <Form.Control type="number" placeholder="Age" name="age" value={newKid.age} onChange={handleKidChange} required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="kidClub">
                    <Form.Label>Club</Form.Label>
                    <Form.Control type="text" placeholder="Club" name="club" value={newKid.club} onChange={handleKidChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="kidLevel">
                    <Form.Label>Level*</Form.Label>
                    <Form.Select name="level" value={newKid.level} onChange={handleKidChange} required>
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
                <Form.Label>Medical Info</Form.Label>
                <Form.Control as="textarea" rows={2} placeholder="Medical Info" name="medicalInfo" value={newKid.medicalInfo} onChange={handleKidChange} />
              </Form.Group>
              <Button type="submit" className="btn-warning text-dark fw-bold me-2">
                {editKidId ? "Update Kid" : "Add Kid"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
  
        <Card className="shadow" style={{ borderRadius: '1rem', border: '2px solid #FFD700' }}>
          <Card.Header className="bg-dark text-warning fw-bold fs-5 text-center">Kids List</Card.Header>
          <Card.Body>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Club</th>
                  <th>Level</th>
                  <th>Medical Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {kidsList.map((kid) => (
                  <tr key={kid.id}>
                    <td>{kid.firstName} {kid.lastName}</td>
                    <td>{kid.age}</td>
                    <td>{kid.club}</td>
                    <td>{kid.level}</td>
                    <td>{kid.medicalInfo}</td>
                    <td>
                      <Button size="sm" variant="info" className="me-2" onClick={() => handleEditKid(kid)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteKid(kid.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
  
}
