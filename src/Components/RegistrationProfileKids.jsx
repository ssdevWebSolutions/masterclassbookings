"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card, Container, Row, Col, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchKids, addKid, updateKid, deleteKid } from "../Redux/Kids/KidActions";
import { useRouter } from "next/router";
import { fetchBookings } from "@/Redux/bookingSlice/bookingSlice";

export default function RegistrationProfileKids() {
  const dispatch = useDispatch();
  const kidsList = useSelector(state => state.kids.list);
  const loginData = useSelector(state => state.auth.loginData);
  const bookings = useSelector(state => state.bookings.bookings || []);
  const token = loginData.token;
  const role = loginData.role;
  const parentId = loginData.id;

  const [parentData, setParentData] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [newKid, setNewKid] = useState({ firstName: "", lastName: "", age: "", club: "", medicalInfo: "", level: "" });
  const [editKidId, setEditKidId] = useState(null);
  const [ageError, setAgeError] = useState("");
  const kidstate = useSelector(state => state.kids.list);
  const router = useRouter();

  useEffect(()=>{
    dispatch(fetchBookings({ token, role, parentId }));
    // console.log(kidstate,"pp");
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
    
    // Validate age input
    if (name === "age") {
      const ageValue = parseInt(value);
      if (value && ageValue > 14) {
        setAgeError("Kids above 14 years old cannot be registered");
      } else {
        setAgeError("");
      }
    }
    
    setNewKid({ ...newKid, [name]: value });
  };

  const handleAddOrUpdateKid = (e) => {
    e.preventDefault();
    
    // Validate age before submission
    const ageValue = parseInt(newKid.age);
    if (ageValue > 14) {
      alert("Cannot register kids above 14 years old. Please check the age and try again.");
      return;
    }
    
    if (editKidId) {
      dispatch(updateKid(editKidId, newKid ,loginData.token));
      setEditKidId(null);
    } else {
      // console.log(loginData.id,"id");
      dispatch(addKid( loginData.id, newKid ,loginData.token));
    }
    setNewKid({ firstName:"", lastName:"", age:"", club:"", medicalInfo:"", level:"" });
    setAgeError("");
  };

  const handleEditKid = (kid) => {
    setEditKidId(kid.id);
    setNewKid(kid);
  };

  const handleDeleteKid = (kidId) => {
    // dispatch(deleteKid(kidId,loginData.id,loginData.token));
    
  };

  return (
    <>
      <Container className="my-5" style={{ maxWidth: "1100px" }}>
  
        {/* 🔙 Back Button */}
        <div className="mb-4">
          <Button
            variant="outline-warning"
            className="fw-bold px-4"
            style={{ borderRadius: "8px" }}
            onClick={() => window.history.back()}
          >
            ← Back
          </Button>
        </div>
  
        {/* 🧒 Add / Edit Kid */}
        <Card
          className="mb-4 shadow-sm"
          style={{
            borderRadius: "14px",
            border: "2px solid rgba(255,193,7,0.6)",
          }}
        >
          <Card.Header
            className="text-center fw-bold"
            style={{
              background: "#111",
              color: "#FFC107",
              fontSize: "1.2rem",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            }}
          >
            Kids Profile
          </Card.Header>
  
          <Card.Body>
            <Form onSubmit={handleAddOrUpdateKid}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">First Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={newKid.firstName}
                      onChange={handleKidChange}
                      required
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Group>
                </Col>
  
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Last Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={newKid.lastName}
                      onChange={handleKidChange}
                      required
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
  
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Age*</Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      value={newKid.age}
                      onChange={handleKidChange}
                      min="1"
                      max="14"
                      required
                      isInvalid={ageError !== ""}
                      style={{ borderRadius: "8px" }}
                    />
                    {ageError && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {ageError}
                      </Form.Control.Feedback>
                    )}
                    <Form.Text muted>Max age: 14</Form.Text>
                  </Form.Group>
                </Col>
  
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Club</Form.Label>
                    <Form.Control
                      type="text"
                      name="club"
                      value={newKid.club}
                      onChange={handleKidChange}
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Group>
                </Col>
  
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Level*</Form.Label>
                    <Form.Select
                      name="level"
                      value={newKid.level}
                      onChange={handleKidChange}
                      required
                      style={{ borderRadius: "8px" }}
                    >
                      <option value="">Select Level</option>
                      <option>School</option>
                      <option>Club</option>
                      <option>Borough/District</option>
                      <option>Regional</option>
                      <option>County</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
  
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Medical Info</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="medicalInfo"
                  value={newKid.medicalInfo}
                  onChange={handleKidChange}
                  style={{ borderRadius: "8px" }}
                />
              </Form.Group>
  
              <Button
                type="submit"
                className="fw-bold px-4"
                variant="warning"
                disabled={ageError !== ""}
                style={{
                  borderRadius: "8px",
                  color: "#000",
                }}
              >
                {editKidId ? "Update Kid" : "Add Kid"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
  
        {/* 📋 Kids List */}
        <Card
          className="shadow-sm"
          style={{
            borderRadius: "14px",
            border: "2px solid rgba(255,193,7,0.6)",
          }}
        >
          <Card.Header
            className="text-center fw-bold"
            style={{
              background: "#111",
              color: "#FFC107",
              fontSize: "1.2rem",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            }}
          >
            Kids List
          </Card.Header>
  
          <Card.Body>
            <Table
              responsive
              hover
              bordered
              className="align-middle"
            >
              <thead style={{ background: "#FFF8E1" }}>
                <tr className="text-center">
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
                    <td className="text-center">{kid.age}</td>
                    <td>{kid.club || "-"}</td>
                    <td>{kid.level}</td>
                    <td>{kid.medicalInfo || "-"}</td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="outline-warning"
                        className="fw-semibold"
                        style={{ borderRadius: "6px" }}
                        onClick={() => handleEditKid(kid)}
                      >
                        Edit
                      </Button>
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