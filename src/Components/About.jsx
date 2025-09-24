import React from "react";

export default function About() {
  return (
    <section id="about" className="container py-5">
      <div className="row align-items-center g-4">
        <div className="col-md-6">
          <img
            src="/about.jpg"
            alt="About Cricket Camp"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-4 fw-bold text-dark">About Our Camps</h2>
          <p className="text-secondary mb-3">
            Our cricket camps provide high-quality training with professional
            coaches, focusing on batting, bowling, and fielding drills.
          </p>
          <p className="text-secondary">
            We offer flexible slots, modern facilities, and a fun learning
            environment for kids of all ages.
          </p>
        </div>
      </div>
    </section>
  );
}
