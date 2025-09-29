import React, { useEffect, useState } from "react";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure animation triggers
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Reset animation when component unmounts
    return () => {
      clearTimeout(timer);
      setIsLoaded(false);
    };
  }, []);

  const styles = {
    section: {
      // backgroundColor: '#212529',
      backgroundColor: '#111111',
      color: '#ffffff',
      padding: '80px 20px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '500px'
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to bottom right, rgba(255, 193, 7, 0.05), transparent)',
      zIndex: 1
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10
    },
    badge: {
      display: 'inline-block',
      padding: '8px 16px',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      border: '1px solid rgba(255, 193, 7, 0.2)',
      borderRadius: '50px',
      marginBottom: '32px',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
      transition: 'opacity 1.2s ease, transform 1.2s ease'
    },
    badgeText: {
      margin: 0,
      fontSize: '14px',
      fontWeight: '500',
      color: '#ffc107',
      letterSpacing: '0.05em'
    },
    heading: {
      fontSize: '3.5rem',
      fontWeight: '700',
      marginBottom: '24px',
      lineHeight: '1.2',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1.4s ease 0.4s, transform 1.4s ease 0.4s'
    },
    headingSpan: {
      color: '#FFD700'
    },
    tagsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '40px',
      fontSize: '18px',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1.4s ease 0.8s, transform 1.4s ease 0.8s'
    },
    tag: {
      padding: '10px 16px',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      color: '#ffc107',
      borderRadius: '6px',
      fontWeight: '500'
    },
    separator: {
      color: '#6c757d'
    },
    button: {
      backgroundColor: '#ffc107',
      color: '#212529',
      padding: '14px 32px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 10px 25px rgba(255, 193, 7, 0.2)',
      transition: 'all 0.3s ease, opacity 1.4s ease 1.2s, transform 1.4s ease 1.2s',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
      position: 'relative',
      overflow: 'hidden'
    },
    buttonRipple: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '0',
      height: '0',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      animation: 'ripple 2s infinite'
    },
    decorativeLine: {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '1px',
      height: isLoaded ? '64px' : '0',
      background: 'linear-gradient(to bottom, rgba(255, 193, 7, 0.5), transparent)',
      zIndex: 10,
      transition: 'height 1.4s ease 1.6s'
    }
  };

  const handleBookNowClick = () => {
    const campGridSection = document.getElementById('camps');
    if (campGridSection) {
      campGridSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section style={styles.section}>
      <style>
        {`
          @keyframes ripple {
            0% {
              width: 0;
              height: 0;
              opacity: 0.8;
            }
            100% {
              width: 200px;
              height: 200px;
              opacity: 0;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-3px) scale(1.02);
            }
          }
          
          .book-now-btn {
            animation: pulse 2.5s ease-in-out infinite;
            animation-delay: 3s;
          }
          
          .book-now-btn:hover {
            animation: none !important;
          }
        `}
      </style>
      {/* Subtle gradient overlay */}
      <div style={styles.gradientOverlay}></div>
      
      <div style={styles.container}>
        {/* Badge */}
        <div style={styles.badge}>
          <p style={styles.badgeText}>
            WINTER SEASON 2025
          </p>
        </div>
        
        {/* Heading */}
        <h2 style={styles.heading}>
          Book Your Winter<br />
          <span style={{color:'#FFD700'}}>Masterclass Coaching</span>
        </h2>
        
        {/* Tags */}
        <div style={styles.tagsContainer}>
          <span style={styles.tag}>Clinics</span>
          <span style={styles.separator}>&</span>
          <span style={styles.tag}>Camps</span>
        </div>
        
        {/* Button */}
        <button 
          className="book-now-btn"
          style={styles.button}
          onClick={handleBookNowClick}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#ffcd39';
            e.target.style.transform = 'translateY(-4px) scale(1.05)';
            e.target.style.boxShadow = '0 15px 35px rgba(255, 193, 7, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#ffc107';
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 25px rgba(255, 193, 7, 0.2)';
          }}
        >
          Book Now →
        </button>
      </div>
      
      {/* Decorative element */}
      <div style={styles.decorativeLine}></div>
    </section>
  );
}