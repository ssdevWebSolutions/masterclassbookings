import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
      <p className="mb-2 mb-md-0 text-center" style={{ color: "#ffffff", fontSize: "14px" }}>
  &copy; 2025 MasterClass Cricket. All rights reserved. | made with <span style={{ color: "#ff4d4d" }}>❤️</span> by{' '}
  <a 
    href="https://ssdev.tech" 
    target="_blank" 
    rel="noopener noreferrer" 
    style={{ color: "inherit", textDecoration: "none" }}
  >
    ssdev.tech
  </a>
</p>

        {/* <div className="d-flex gap-3">
          <a href="#" className="text-white text-decoration-none" style={{ transition: "color 0.3s" }}
             onMouseEnter={e => e.target.style.color = "#FFD700"}
             onMouseLeave={e => e.target.style.color = "white"}>
            Facebook
          </a>
          <a href="#" className="text-white text-decoration-none" style={{ transition: "color 0.3s" }}
             onMouseEnter={e => e.target.style.color = "#FFD700"}
             onMouseLeave={e => e.target.style.color = "white"}>
            Instagram
          </a>
          <a href="#" className="text-white text-decoration-none" style={{ transition: "color 0.3s" }}
             onMouseEnter={e => e.target.style.color = "#FFD700"}
             onMouseLeave={e => e.target.style.color = "white"}>
            Twitter
          </a>
        </div> */}
      </div>
    </footer>
  );
}
