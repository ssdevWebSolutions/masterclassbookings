import React, { useEffect } from 'react';
import { MessageCircle, AlertCircle } from 'lucide-react';
import styles from './MaintenanceNotice.module.css';

const MaintenanceNotice = () => {
  // Prevent navigation and back button
  useEffect(() => {
    // Disable back button
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };

    // Prevent right-click and keyboard shortcuts
    const preventActions = (e) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
      ) {
        e.preventDefault();
        return false;
      }
    };

    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('keydown', preventActions);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('keydown', preventActions);
      document.removeEventListener('contextmenu', preventContextMenu);
      window.onpopstate = null;
    };
  }, []);

  const handleWhatsAppClick = () => {
    // Replace with your WhatsApp number (format: country code + number without + or spaces)
    // Example: For +91 9876543210, use 919876543210
    const whatsappNumber = '447961692226'; 
    const message = encodeURIComponent('Hi, I would like to make a booking for cricket camp.');
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Main Card */}
        <div className={styles.card}>
          {/* Header with Icon */}
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <AlertCircle className={styles.icon} size={48} />
            </div>
            <h1 className={styles.title}>System Maintenance</h1>
            <p className={styles.subtitle}>We're improving your booking experience</p>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.textCenter}>
              <h2 className={styles.heading}>
                Booking System Temporarily Unavailable
              </h2>
              <p className={styles.description}>
                Our online booking system is currently under maintenance to serve you better. 
                During this period, we're accepting bookings through WhatsApp.
              </p>
              
              {/* Info Box */}
              <div className={styles.infoBox}>
                <h3 className={styles.infoTitle}>
                  <AlertCircle size={20} className={styles.infoIcon} />
                  Maintenance Period
                </h3>
                <p className={styles.infoText}>
                  <strong>Duration:</strong> This week
                  <br />
                  <strong>Alternative:</strong> Book directly via WhatsApp
                </p>
              </div>

              {/* WhatsApp Button */}
              <button onClick={handleWhatsAppClick} className={styles.whatsappBtn}>
                <MessageCircle size={24} className={styles.btnIcon} />
                <span>Book via WhatsApp</span>
              </button>

              <p className={styles.helperText}>
                Click the button above to send us a message on WhatsApp
              </p>
            </div>

            {/* Additional Info */}
            <div className={styles.footer}>
              <p className={styles.footerText}>
                We appreciate your patience and understanding
              </p>
              <p className={styles.footerSubtext}>
                Our team will respond to your WhatsApp message promptly
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className={styles.note}>
          <p>Thank you for choosing our cricket camps! 🏏</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceNotice;