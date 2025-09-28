import React from "react";

export default function About() {
  return (
    <section id="about" className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-light text-dark mb-3">About Our Clinics</h2>
              <div className="mx-auto bg-primary" style={{width: '60px', height: '3px'}}></div>
            </div>
            
            <div className="fs-6 lh-base">
              <p className="text-muted mb-4">
                At <strong className="text-dark">Masterclass Cricket Academy</strong>, our Autumn/Winter Clinic is all about 
                <strong className="text-dark"> genuine player development</strong>. Designed for young cricketers aged 8–13, this 
                10-week programme focuses on core technical skills – batting, bowling, and fielding – 
                delivered through structured drills, video analysis, and proven biomechanics expertise.
              </p>
              
              <p className="text-muted mb-4">
                Led by <strong className="text-dark">Head Coach Uzi Arif</strong> and the Masterclass team, players don't just 
                train – they learn to perform under pressure, build confidence, and develop repeatable 
                skills that transfer directly into matches.
              </p>
              
              <p className="text-muted mb-0">
                What makes Masterclass different? We don't run "feel-good" sessions. We deliver{" "}
                <strong className="text-dark">measurable improvement</strong> in a fun, challenging environment where every 
                player is pushed to unlock their true potential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}