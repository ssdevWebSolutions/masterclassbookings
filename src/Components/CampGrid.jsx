import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";

// Camp data
const camps = [
  {
    title: "Winter coaching Clinics - Class 1",
    desc: "Block 1: Technical Development Programme",
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

// Centered Toast Component
function CenterToast({ message, onClose }) {
  const toastStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease'
    },
    toast: {
      minWidth: '320px',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      animation: 'slideUp 0.3s ease'
    },
    message: {
      fontSize: '16px',
      color: '#212529',
      marginBottom: '1.5rem',
      lineHeight: '1.5'
    },
    button: {
      backgroundColor: '#ffc107',
      color: '#212529',
      padding: '10px 24px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    }
  };

  return (
    <div style={toastStyles.overlay} onClick={onClose}>
      <div style={toastStyles.toast} onClick={(e) => e.stopPropagation()}>
        <div style={toastStyles.message}>{message}</div>
        <button 
          style={toastStyles.button}
          onClick={onClose}
          onMouseOver={(e) => e.target.style.backgroundColor = '#ffcd39'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function CampGrid() {
  const router = useRouter();
  const loginData = useSelector((state) => state.auth.loginData);
  const [toastVisible, setToastVisible] = useState(false);

  const handleRoute = (path) => {
    if (loginData?.token) {
      router.push(path);
    } else {
      setToastVisible(true);
    }
  };

  const styles = {
    section: {
      padding: '100px 20px',
      backgroundColor: '#ffffff',
      position: 'relative'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '60px'
    },
    badge: {
      display: 'inline-block',
      padding: '6px 16px',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      color: '#ffc107',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.1em',
      borderRadius: '20px',
      marginBottom: '16px',
      textTransform: 'uppercase'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#212529',
      marginBottom: '12px'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#6c757d',
      fontWeight: '300',
      maxWidth: '600px',
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '40px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: '#f8f9fa',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #e9ecef'
    },
    imageContainer: {
      width: '100%',
      height: '300px',
      overflow: 'hidden',
      backgroundColor: '#e9ecef',
      position: 'relative'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease'
    },
    cardBody: {
      padding: '32px'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '12px'
    },
    cardDesc: {
      fontSize: '0.95rem',
      color: '#6c757d',
      lineHeight: '1.6',
      marginBottom: '24px',
      minHeight: '60px'
    },
    button: {
      backgroundColor: '#ffc107',
      color: '#212529',
      padding: '12px 28px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-block'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          @media (max-width: 768px) {
            .camp-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
      <section id="camps" style={styles.section}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.badge}>Our Programs</div>
            <h2 style={styles.title}>Winter Masterclasses</h2>
            <p style={styles.subtitle}>
              {/* Elite training programs designed to elevate your cricket skills */}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="camp-grid" style={styles.grid}>
            {camps.map((camp, idx) => (
              <div
                key={idx}
                style={styles.card}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <div style={styles.imageContainer}>
                  <img
                    src={camp.img}
                    alt={camp.title}
                    style={styles.image}
                  />
                </div>
                <div style={styles.cardBody}>
                  <h5 style={styles.cardTitle}>{camp.title}</h5>
                  <p style={styles.cardDesc}>{camp.desc}</p>
                  <button
                    style={styles.button}
                    onClick={() => handleRoute(camp.path)}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#ffcd39';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#ffc107';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    Book Your Slot →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toast */}
        {toastVisible && (
          <CenterToast
            message="Please login before booking a slot."
            onClose={() => setToastVisible(false)}
          />
        )}
      </section>
    </>
  );
}