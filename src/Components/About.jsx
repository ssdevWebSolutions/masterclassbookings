import React from "react";

export default function About() {
  return (
    <section id="about" className="container py-5">
      <div className="row align-items-center g-4">
        {/* Image Carousel */}
        <div className="col-md-6">
          <div
            id="aboutCarousel"
            className="carousel slide carousel-fade rounded shadow"
            data-bs-ride="carousel"
            data-bs-interval="3000" // 3 seconds per slide
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="Black White and Orange Photocentric Sports Cricket Flyer (1).png"
                  className="d-block w-100 img-fluid"
                  alt="Cricket Training 1"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="Black White and Orange Photocentric Sports Cricket Flyer.png"
                  className="d-block w-100 img-fluid"
                  alt="Cricket Training 2"
                />
              </div>
              <div className="carousel-item">
                <img
                  src="Black White and Orange Photocentric Sports Cricket Flyer.png"
                  className="d-block w-100 img-fluid"
                  alt="Cricket Training 3"
                />
              </div>
            </div>

            {/* Controls */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#aboutCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#aboutCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        {/* Text Section */}
        <div className="col-md-6">
          <h2 className="mb-4 fw-bold text-dark">About Our Clinics</h2>
          <p className="text-secondary mb-3">
            At <strong>Masterclass Cricket Academy</strong>, our Autumn/Winter Clinic is all about
            <strong> real player development</strong>. Designed for young cricketers aged 8–13, this
            10-week programme focuses on the core technical skills – batting, bowling, and fielding –
            taught through structured drills, video analysis, and proven biomechanics expertise.
          </p>
          <p className="text-secondary mb-3">
            Led by <strong>Head Coach Uzi Arif</strong> and the Masterclass team, players don’t just
            train – they learn to perform under pressure, grow in confidence, and build repeatable
            skills that transfer directly into matches.
          </p>
          <p className="text-secondary">
            What makes Masterclass different? We don’t run “feel-good” sessions. We deliver{" "}
            <strong>measurable improvement</strong> in a fun, challenging environment where every
            player is pushed to unlock their true potential.
          </p>
        </div>
      </div>
    </section>
  );
}
