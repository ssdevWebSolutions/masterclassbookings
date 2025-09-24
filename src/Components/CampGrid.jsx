import React from "react";

const camps = [
  {
    title: "Winter coaching Clinics - Class 1",
    desc: "Venue: Tiffin Girls School KT2 5PL ",
    img: "Black White and Orange Photocentric Sports Cricket Flyer.png",
  },
  {
    title: "Winter coaching Clinics - Class 2",
    desc: "Venue: Tiffin Girls School KT2 5PL",
    img: "Black White and Orange Photocentric Sports Cricket Flyer (1).png",
  },
];

export default function CampGrid() {
  return (
    <section id="camps" className="container py-5">
      <h2 className="text-center mb-4 fw-bold text-dark">Our Camps</h2>
      <div className="row g-4">
        {camps.map((camp, idx) => (
          <div key={idx} className="col-md-6">
            <div className="card h-100 shadow-sm" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
              <img
                src={camp.img}
                className="card-img-top"
                alt={camp.title}
                style={{ height: "20rem", objectFit: "fit" }}
              />
              <div className="card-body">
                <h5 className="card-title text-dark">{camp.title}</h5>
                <p className="card-text text-secondary">{camp.desc}</p>
                <button className="btn btn-warning text-dark fw-semibold">
                  Book Slot
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
