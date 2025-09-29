import React from "react";

export default function Footer() {
  const styles = {
    footer: {
      backgroundColor: '#212529',
      color: '#ffffff',
      padding: '40px 20px',
      marginTop: '1px',
      borderTop: '1px solid rgba(255, 193, 7, 0.1)'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // gap: '16px'
    },
    brand: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#ffc107',
      marginBottom: '8px'
    },
    copyright: {
      fontSize: '14px',
      color: '#9ca3af',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    heart: {
      color: '#ff4d4d',
      display: 'inline-block',
      animation: 'heartbeat 1.5s ease-in-out infinite'
    },
    link: {
      color: '#ffc107',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'opacity 0.3s ease'
    },
    divider: {
      width: '60px',
      height: '2px',
      backgroundColor: 'rgba(255, 193, 7, 0.3)',
      margin: '8px 0'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            10%, 30% { transform: scale(1.1); }
            20%, 40% { transform: scale(1); }
          }
          
          @media (max-width: 768px) {
            .footer-container {
              padding: 30px 20px !important;
            }
          }
        `}
      </style>
      <footer style={styles.footer} className="">
        <div style={styles.container} className="footer-container ">
          <div style={styles.brand}>MasterClass Cricket</div>
          <div style={styles.divider}></div>
          <p style={styles.copyright}>
            © 2025 MasterClass Cricket. All rights reserved.<br />
            Made with <span style={styles.heart}>❤️</span> by{' '}
            <a 
              href="https://ssdev.tech" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.link}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ssdev.tech
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}