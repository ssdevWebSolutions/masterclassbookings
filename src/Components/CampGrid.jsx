import { loginModal, loginModalForSlice } from "@/Redux/Authentication/AuthenticationAction";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// Camp data
const camps = [
  {
    title: "Winter coaching Clinics - Block 1",
    desc: "Block 1: Technical Development Programme",
    img: "Block1.png",
    path: "/class1",
  },
  {
    title: "Winter coaching Clinics - Block 2",
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
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    toast: {
      minWidth: '380px',
      padding: '3rem 2.5rem',
      backgroundColor: '#000000',
      border: '1px solid #FFD700',
      borderRadius: '2px',
      boxShadow: '0 25px 80px rgba(212, 175, 55, 0.2)',
      textAlign: 'center',
      animation: 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    },
    accent: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '2px',
      backgroundColor: '#FFD700',
      boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
    },
    message: {
      fontSize: '16px',
      color: '#FFFFFF',
      marginBottom: '2rem',
      lineHeight: '1.8',
      fontWeight: '300',
      letterSpacing: '0.02em'
    },
    button: {
      backgroundColor: 'transparent',
      color: '#FFD700',
      padding: '12px 32px',
      border: '1px solid #FFD700',
      borderRadius: '2px',
      fontSize: '13px',
      fontWeight: '500',
      letterSpacing: '0.15em',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      textTransform: 'uppercase'
    }
  };
   

  const dispatch = useDispatch();

  const handleClose = () => {
    // console.log("hello");
    dispatch(loginModalForSlice(true));
    onClose();
  };

  return (
    <div style={toastStyles.overlay} onClick={handleClose}>
      <div style={toastStyles.toast} onClick={(e) => e.stopPropagation()}>
        <div style={toastStyles.accent}></div>
        <div style={toastStyles.message}>{message}</div>
        <button 
          style={toastStyles.button}
          onClick={handleClose}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#FFD700';
            e.target.style.color = '#000000';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#FFD700';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default function CampGrid() {
  const router = useRouter();
  const loginData = useSelector((state) => state.auth.loginData);
  const [toastVisible, setToastVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = cardRefs.current.indexOf(entry.target);
        if (entry.isIntersecting) {
          if (index !== -1 && !visibleCards.includes(index)) {
            setVisibleCards(prev => [...prev, index]);
          }
        } else {
          if (index !== -1 && visibleCards.includes(index)) {
            setVisibleCards(prev => prev.filter(i => i !== index));
          }
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [visibleCards]);

  const handleRoute = (path) => {
    if (loginData?.token) {
      router.push(path);
    } else {
      setToastVisible(true);
    }
  };

  const styles = {
    section: {
      padding: '120px 40px',
      backgroundColor: '#000000',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)',
      pointerEvents: 'none'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    },
    header: {
      textAlign: 'center',
      marginBottom: '0px'
    },
    badge: {
      display: 'inline-block',
      padding: '8px 24px',
      backgroundColor: 'transparent',
      color: '#FFD700',
      fontSize: '11px',
      fontWeight: '500',
      letterSpacing: '0.2em',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '2px',
      marginBottom: '24px',
      textTransform: 'uppercase',
      animation: 'fadeInDown 0.8s ease'
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '300',
      color: '#FFFFFF',
      marginBottom: '24px',
      letterSpacing: '0.02em',
      animation: 'fadeInUp 0.8s ease 0.2s backwards'
    },
    titleAccent: {
      color: '#FFD700',
      fontWeight: '400'
    },
    decorativeLine: {
      width: '80px',
      height: '1px',
      backgroundColor: '#FFD700',
      margin: '40px auto',
      position: 'relative',
      animation: 'expandWidth 1s ease 0.4s backwards'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(550px, 1fr))',
      gap: '60px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: '#0A0A0A',
      border: '1px solid rgba(212, 175, 55, 0.15)',
      borderRadius: '2px',
      overflow: 'hidden',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      animation: 'fadeInUp 0.8s ease backwards'
    },
    cardGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: '#FFD700',
      transform: 'scaleX(0)',
      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)'
    },
    imageContainer: {
      width: '100%',
      height: '320px',
      overflow: 'hidden',
      backgroundColor: '#000000',
      position: 'relative'
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
      transition: 'opacity 0.6s ease',
      opacity: 0.6
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      filter: 'grayscale(0.3) contrast(1.1)'
    },
    cardBody: {
      padding: '48px 40px',
      position: 'relative'
    },
    cardNumber: {
      position: 'absolute',
      top: '-30px',
      right: '40px',
      fontSize: '120px',
      fontWeight: '700',
      color: 'rgba(212, 175, 55, 0.05)',
      lineHeight: '1',
      pointerEvents: 'none'
    },
    cardTitle: {
      fontSize: '1.4rem',
      fontWeight: '400',
      color: '#FFFFFF',
      marginBottom: '16px',
      letterSpacing: '0.02em',
      transition: 'color 0.4s ease'
    },
    cardDesc: {
      fontSize: '0.95rem',
      color: '#999999',
      lineHeight: '1.8',
      marginBottom: '36px',
      minHeight: '60px',
      fontWeight: '300',
      letterSpacing: '0.01em'
    },
    buttonContainer: {
      position: 'relative',
      display: 'inline-block'
    },
    button: {
      backgroundColor: 'transparent',
      color: '#FFD700',
      padding: '14px 36px',
      border: '1px solid #FFD700',
      borderRadius: '2px',
      fontSize: '12px',
      fontWeight: '500',
      letterSpacing: '0.15em',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      textTransform: 'uppercase',
      position: 'relative',
      overflow: 'hidden'
    },
    buttonBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '0%',
      height: '100%',
      backgroundColor: '#FFD700',
      transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: -1
    },
    arrow: {
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
              transform: translateY(30px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes expandWidth {
            from {
              width: 0;
            }
            to {
              width: 80px;
            }
          }
          .camp-card:nth-child(1) {
            animation-delay: 0.1s;
          }
          .camp-card:nth-child(2) {
            animation-delay: 0.2s;
          }
          .card-visible {
            transform: translateY(-12px) !important;
            border-color: rgba(212, 175, 55, 0.4) !important;
            box-shadow: 0 30px 80px rgba(212, 175, 55, 0.15) !important;
          }
          .card-visible .card-glow {
            transform: scaleX(1) !important;
          }
          .card-visible img {
            transform: scale(1.08) !important;
            filter: grayscale(0) contrast(1.1) !important;
          }
          .card-visible .image-overlay {
            opacity: 0.3 !important;
          }
          .card-visible .card-title {
            color: #FFD700 !important;
          }
          .card-visible .button-bg {
            width: 100% !important;
          }
          .card-visible .book-button {
            color: #000000 !important;
            border-color: #FFD700 !important;
          }
          .card-visible .arrow {
            transform: translateX(8px) !important;
          }
          @media (min-width: 769px) {
            .card-visible {
              transform: translateY(0) !important;
              border-color: rgba(212, 175, 55, 0.15) !important;
              box-shadow: none !important;
            }
            .card-visible .card-glow {
              transform: scaleX(0) !important;
            }
            .card-visible img {
              transform: scale(1) !important;
              filter: grayscale(0.3) contrast(1.1) !important;
            }
            .card-visible .image-overlay {
              opacity: 0.6 !important;
            }
            .card-visible .card-title {
              color: #FFFFFF !important;
            }
            .card-visible .button-bg {
              width: 0% !important;
            }
            .card-visible .book-button {
              color: #FFD700 !important;
              border-color: #FFD700 !important;
            }
            .card-visible .arrow {
              transform: translateX(0) !important;
            }
          }
          @media (max-width: 1200px) {
            .camp-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
          }
          @media (max-width: 768px) {
            .camp-grid {
              grid-template-columns: 1fr !important;
            }
            .image-container {
              height: 280px !important;
            }
            .card-body-responsive {
              padding: 36px 28px !important;
            }
            .title-responsive {
              font-size: 2.5rem !important;
            }
          }
          @media (max-width: 480px) {
            .image-container {
              height: 240px !important;
            }
            .card-body-responsive {
              padding: 32px 24px !important;
            }
            .title-responsive {
              font-size: 2rem !important;
            }
            .section-responsive {
              padding: 0px 20px 60px !important;
            }
          }
        `}
      </style>
      <section id="camps" style={styles.section} className="section-responsive">
        <div style={styles.backgroundPattern}></div>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.badge}>Our Programs</div>
            <h2 style={styles.title} className="title-responsive">
              Winter <span style={styles.titleAccent}>Masterclasses</span>
            </h2>
            <div style={styles.decorativeLine}></div>
          </div>

          {/* Cards Grid */}
          <div className="camp-grid" style={styles.grid}>
            {camps.map((camp, idx) => (
              <div
                key={idx}
                ref={(el) => (cardRefs.current[idx] = el)}
                className={`camp-card ${visibleCards.includes(idx) ? 'card-visible' : ''}`}
                style={styles.card}
                onMouseOver={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(-12px)';
                  card.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  card.style.boxShadow = '0 30px 80px rgba(212, 175, 55, 0.15)';
                  
                  const glow = card.querySelector('.card-glow');
                  if (glow) glow.style.transform = 'scaleX(1)';
                  
                  const img = card.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1.08)';
                    img.style.filter = 'grayscale(0) contrast(1.1)';
                  }
                  
                  const overlay = card.querySelector('.image-overlay');
                  if (overlay) overlay.style.opacity = '0.3';
                  
                  const title = card.querySelector('.card-title');
                  if (title) title.style.color = '#FFD700';

                  const buttonBg = card.querySelector('.button-bg');
                  if (buttonBg) buttonBg.style.width = '100%';

                  const button = card.querySelector('.book-button');
                  if (button) {
                    button.style.color = '#000000';
                    button.style.borderColor = '#FFD700';
                  }

                  const arrow = card.querySelector('.arrow');
                  if (arrow) arrow.style.transform = 'translateX(8px)';
                }}
                onMouseOut={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(0)';
                  card.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                  card.style.boxShadow = 'none';
                  
                  const glow = card.querySelector('.card-glow');
                  if (glow) glow.style.transform = 'scaleX(0)';
                  
                  const img = card.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1)';
                    img.style.filter = 'grayscale(0.3) contrast(1.1)';
                  }
                  
                  const overlay = card.querySelector('.image-overlay');
                  if (overlay) overlay.style.opacity = '0.6';
                  
                  const title = card.querySelector('.card-title');
                  if (title) title.style.color = '#FFFFFF';

                  const buttonBg = card.querySelector('.button-bg');
                  if (buttonBg) buttonBg.style.width = '0%';

                  const button = card.querySelector('.book-button');
                  if (button) {
                    button.style.color = '#FFD700';
                    button.style.borderColor = '#FFD700';
                  }

                  const arrow = card.querySelector('.arrow');
                  if (arrow) arrow.style.transform = 'translateX(0)';
                }}
              >
                <div className="card-glow" style={styles.cardGlow}></div>
                <div style={styles.imageContainer} className="image-container">
                  <div className="image-overlay" style={styles.imageOverlay}></div>
                  <img
                    src={camp.img}
                    alt={camp.title}
                    style={styles.image}
                  />
                </div>
                <div style={styles.cardBody} className="card-body-responsive">
                  <div style={styles.cardNumber}>{String(idx + 1).padStart(2, '0')}</div>
                  <h5 className="card-title" style={styles.cardTitle}>{camp.title}</h5>
                  <p style={styles.cardDesc}>{camp.desc}</p>
                  <div style={styles.buttonContainer}>
                    <button
                      className="book-button"
                      style={styles.button}
                      onClick={() => handleRoute(camp.path)}
                    >
                      <div className="button-bg" style={styles.buttonBg}></div>
                      <span style={{ position: 'relative', zIndex: 1 }}>Book Your Slot</span>
                      <span className="arrow" style={{...styles.arrow, position: 'relative', zIndex: 1}}>→</span>
                    </button>
                  </div>
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