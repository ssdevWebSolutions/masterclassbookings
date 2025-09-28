import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

// Camp data
const camps = [
  {
    title: "Winter coaching Clinics - Class 1",
    desc: "Block 1: Technical Development Programme ",
    img: "Block1.png",
    path: "/class1",
  },
  {
    title: "Winter coaching Clinics - Class 2",
    desc: "Block 2: Game based scenarios game plan, target practice learning to bat in different scenarios field settings repeated for the games",
    img: "Block2.png",
    path: "/class2",
  },
];

// ✅ Centered Toast Component
function CenterToast({ message, onClose }) {
  return (
    <div
      className="position-fixed top-50 start-50 translate-middle"
      style={{
        zIndex: 1050,
        minWidth: "300px",
        padding: "1rem 1.5rem",
        backgroundColor: "#212529",
        color: "#fff",
        borderRadius: "0.5rem",
        boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.3)",
        textAlign: "center",
      }}
    >
      <div>{message}</div>
      <button className="btn btn-sm btn-light mt-3" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default function CampGrid() {
  const router = useRouter();
  const loginData = useSelector((state) => state.auth.loginData);
  const [toastVisible, setToastVisible] = useState(false);

  const handleRoute = (path) => {
    if (loginData.token) {
      router.push(path);
    } else {
      setToastVisible(true);
    }
  };

  return (
    <section id="camps" className="container py-5 position-relative">
      <h2 className="text-center mb-4 fw-bold text-dark">OUR MASTERCLASSES</h2>
      <div className="row g-4">
        {camps.map((camp, idx) => (
          <div key={idx} className="col-md-6">
            <div
              className="card h-100 shadow-sm"
              style={{ backgroundColor: "#f8f9fa", border: "none" }}
            >
              <img
                src={camp.img}
                className="card-img-top"
                alt={camp.title}
                style={{ height: "80%", objectFit: "fit" }}
              />
              <div className="card-body">
                <h5 className="card-title text-dark">{camp.title}</h5>
                <p className="card-text text-secondary">{camp.desc}</p>
                <button
                  className="btn btn-warning text-dark fw-semibold"
                  onClick={() => handleRoute(camp.path)}
                >
                  Book Slot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Render the centered toast only if user not logged in */}
      {toastVisible && (
        <CenterToast
          message="Please login before booking a slot."
          onClose={() => setToastVisible(false)}
        />
      )}
    </section>
  );
}
