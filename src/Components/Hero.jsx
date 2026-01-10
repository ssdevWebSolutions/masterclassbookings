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
      marginBottom: '16px',
      lineHeight: '1.2',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1.4s ease 0.4s, transform 1.4s ease 0.4s'
    },
    headingSpan: {
      color: '#FFD700'
    },
    subtitle: {
      fontSize: '1.2rem',
      fontWeight: '400',
      marginBottom: '32px',
      color: '#e0e0e0',
      maxWidth: '600px',
      margin: '0 auto 32px auto',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1.4s ease 0.6s, transform 1.4s ease 0.6s'
    },
    tagsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '40px',
      fontSize: '16px',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1.4s ease 0.8s, transform 1.4s ease 0.8s',
      flexWrap: 'wrap'
    },
    tag: {
      padding: '8px 14px',
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      color: '#ffc107',
      borderRadius: '6px',
      fontWeight: '500',
      border: '1px solid rgba(255, 193, 7, 0.2)'
    },
    separator: {
      color: '#6c757d',
      display: 'none'
    },
    buttonsContainer: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: isLoaded ? 1 : 0,
      transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1.4s ease 1.2s, transform 1.4s ease 1.2s',
      flexWrap: 'wrap'
    },
    primaryButton: {
      backgroundColor: '#ffc107',
      color: '#212529',
      padding: '14px 32px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 10px 25px rgba(255, 193, 7, 0.2)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#ffffff',
      padding: '14px 32px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
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

  const handleExploreClick = () => {
    const eventsSection = document.getElementById('camps') || document.getElementById('events') || document.getElementById('programs');
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBookNowClick = () => {
    const bookingSection = document.getElementById('booking') || document.getElementById('contact');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section style={styles.section}>
      {/* Subtle gradient overlay */}
      <div style={styles.gradientOverlay}></div>
      
      <div style={styles.container}>
        {/* Badge */}
        <div style={styles.badge}>
          <p style={styles.badgeText}>ELITE CRICKET COACHING</p>
        </div>
        
        {/* Heading */}
        <h1 style={styles.heading}>
          Master Your Cricket Skills with <span style={styles.headingSpan}>Expert Coaching</span>
        </h1>
        
        {/* Subtitle */}
        <p style={styles.subtitle}>
          Discover upcoming camps, clinics, and personalized training sessions. 
          Join our community of passionate cricketers and take your game to the next level.
        </p>
        
        {/* Tags */}
        <div style={styles.tagsContainer}>
          <span style={styles.tag}>Individual Sessions</span>
          <span style={styles.tag}>Group Camps</span>
          <span style={styles.tag}>Masterclasses</span>
          <span style={styles.tag}>Skills Clinics</span>
        </div>
        
        {/* Buttons */}
        <div style={styles.buttonsContainer}>
          <button 
            style={styles.primaryButton}
            onClick={handleExploreClick}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#ffcd39';
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = '0 15px 35px rgba(255, 193, 7, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ffc107';
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 10px 25px rgba(255, 193, 7, 0.2)';
            }}
          >
            Explore Programs →
          </button>
          
          <button 
            style={styles.secondaryButton}
            onClick={handleBookNowClick}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Book Now
          </button>
        </div>
      </div>
      
      {/* Decorative element */}
      <div style={styles.decorativeLine}></div>
    </section>
  );
}
