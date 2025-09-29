import React, { useEffect, useRef, useState } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
    }, observerOptions);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const styles = {
    section: {
      padding: '60px 20px',
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
      backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)',
      pointerEvents: 'none'
    },
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 1
    },
    header: {
      textAlign: 'center',
      marginBottom: '15px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    badge: {
      display: 'inline-block',
      padding: '8px 24px',
      backgroundColor: 'transparent',
      color: '#D4AF37',
      fontSize: '11px',
      fontWeight: '500',
      letterSpacing: '0.2em',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '2px',
      marginBottom: '24px',
      textTransform: 'uppercase'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '400',
      color: '#FFFFFF',
      marginBottom: '24px',
      letterSpacing: '0.02em'
    },
    titleAccent: {
      color:'#FFD700',
      fontWeight: '600'
    },
    decorativeLine: {
      width: '80px',
      height: '1px',
      backgroundColor: '#FFD700',
      margin: '0 auto',
      position: 'relative',
      transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
    },
    content: {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s'
    },
    paragraph: {
      fontSize: '1.05rem',
      color: 'white',
      lineHeight: '2',
      marginBottom: '32px',
      fontWeight: '400',
      letterSpacing: '0.01em',
      textAlign: 'left'
    },
    strong: {
      color: '#D4AF37',
      fontWeight: '600'
    },
    lastParagraph: {
      fontSize: '1.05rem',
      color: '#999999',
      lineHeight: '2',
      marginBottom: '0',
      fontWeight: '400',
      letterSpacing: '0.01em',
      textAlign: 'left'
    },
    quoteAccent: {
      position: 'relative',
      paddingLeft: '32px',
      borderLeft: '2px solid #D4AF37',
      marginTop: '48px',
      marginBottom: '48px'
    },
    quote: {
      fontSize: '1.1rem',
      color: 'white',
      lineHeight: '1.9',
      fontStyle: 'italic',
      fontWeight: '400'
    },
    goldText: {
      color: '#FFD700',
      fontWeight: '600'
    }
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .about-section-responsive {
              padding: 80px 24px !important;
            }
            .about-title-responsive {
              font-size: 2.2rem !important;
            }
            .about-paragraph-responsive {
              font-size: 1rem !important;
              line-height: 1.9 !important;
            }
            .about-quote-responsive {
              font-size: 1.05rem !important;
              padding-left: 24px !important;
            }
          }
          @media (max-width: 480px) {
            .about-section-responsive {
              padding: 60px 20px !important;
            }
            .about-title-responsive {
              font-size: 1.8rem !important;
            }
            .about-paragraph-responsive {
              font-size: 0.95rem !important;
            }
          }
        `}
      </style>
      <section 
        id="about" 
        ref={sectionRef}
        style={styles.section}
        className="about-section-responsive"
      >
        <div style={styles.backgroundPattern}></div>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title} className="about-title-responsive">
              About Our <span style={styles.titleAccent}>Clinics</span>
            </h2>
            <div style={styles.decorativeLine}></div>
          </div>

          {/* Content */}
          <div style={styles.content}>
            <p style={styles.paragraph} className="about-paragraph-responsive">
              At <span style={styles.goldText}>Masterclass Cricket Academy</span>, our Autumn/Winter Clinic is all about{" "}
              <span style={styles.goldText}>genuine player development</span>. Designed for young cricketers aged 8–13, this 
              10-week programme focuses on core technical skills – batting, bowling, and fielding – 
              delivered through structured drills, video analysis, and proven biomechanics expertise.
            </p>
            
            <p style={styles.paragraph} className="about-paragraph-responsive">
              Led by <span style={styles.goldText}>Head Coach Uzi Arif</span> and the Masterclass team, players don't just 
              train – they learn to perform under pressure, build confidence, and develop repeatable 
              skills that transfer directly into matches.
            </p>
            
            <div style={styles.quoteAccent} className="about-quote-responsive">
              <p style={styles.quote} className="about-paragraph-responsive">
                What makes Masterclass different? We don't run "feel-good" sessions. We deliver{" "}
                <span style={styles.goldText}>measurable improvement</span> in a fun, challenging environment where every 
                player is pushed to unlock their true potential.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}