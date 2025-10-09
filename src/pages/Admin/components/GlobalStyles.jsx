export default function GlobalStyles() {
    return (
      <style>{`
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
  
        * {
          box-sizing: border-box;
        }
  
        html, body {
          background: #0a0a0a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
        }
  
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: #0a0a0a;
          position: relative;
          width: 100%;
        }
  
        /* Sidebar Overlay */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 950;
        }
        
        .sidebar-overlay.show {
          opacity: 1;
          visibility: visible;
        }
  
        /* Sidebar Styles */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
          border-right: 2px solid #ffc107;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 1000;
          transition: transform 0.3s ease;
          overflow-y: auto;
          transform: translateX(0);
        }
  
        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #2a2a2a;
          background: #000;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
  
        .sidebar-close-btn {
          display: none;
          background: transparent;
          border: 2px solid #ffc107;
          color: #ffc107;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          align-items: center;
          justify-content: center;
        }
  
        .sidebar-close-btn:hover {
          background: #ffc107;
          color: #000;
          transform: rotate(90deg);
        }
  
        .sidebar-logo {
          font-size: 24px;
          font-weight: 700;
          color: #ffc107;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
  
        .sidebar-nav {
          padding: 20px 0;
        }
  
        .nav-item {
          margin: 4px 12px;
        }
  
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          color: #999;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          font-weight: 500;
          border: 2px solid transparent;
        }
  
        .nav-link:hover {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border-color: #ffc107;
          transform: translateX(4px);
        }
  
        .nav-link.active {
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
          color: #000;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        }
  
        .nav-link svg {
          font-size: 20px;
        }
  
        .sidebar-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          border-top: 1px solid #2a2a2a;
          background: #000;
        }
  
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #1a1a1a;
          border-radius: 12px;
          border: 1px solid #2a2a2a;
          cursor: pointer;
          transition: all 0.3s ease;
        }
  
        .user-profile:hover {
          background: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
        }
  
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffc107, #ffb300);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: 700;
        }
  
        .user-info {
          flex: 1;
        }
  
        .user-name {
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          margin: 0;
        }
  
        .user-role {
          color: #999;
          font-size: 12px;
          margin: 0;
        }
  
        /* Mobile menu button */
        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: 2px solid #ffc107;
          color: #ffc107;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
  
        .mobile-menu-btn:hover {
          background: rgba(255, 193, 7, 0.1);
          transform: scale(1.05);
        }
  
        /* Main Content */
        .main-wrapper {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
          width: calc(100% - 280px);
          min-height: 100vh;
        }
  
        .main-header {
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
          padding: 20px 32px;
          position: sticky;
          top: 0;
          z-index: 900;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
  
        .header-title {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          flex: 1;
          text-align: center;
        }
  
        .main-content {
          padding: 32px;
          min-height: calc(100vh - 80px);
          width: 100%;
          overflow-x: auto;
        }
  
        .content-card {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid #2a2a2a;
          width: 100%;
          overflow-x: auto;
        }
  
        /* Stats Cards */
        .stat-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
          border-radius: 16px;
          border: 1px solid #2a2a2a;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
  
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ffc107, #ffb300);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
  
        .stat-card:hover::before {
          transform: scaleX(1);
        }
  
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(255, 193, 7, 0.2);
          border-color: #ffc107;
        }
  
        .stat-card-body {
          padding: 24px;
        }
  
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
  
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-top: 12px;
          margin-bottom: 4px;
        }
  
        .stat-title {
          font-size: 14px;
          color: #999;
          font-weight: 500;
        }
  
        .stat-subtitle {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }
  
        /* Selected Day Stats Banner */
        .selected-day-banner {
          background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 16px rgba(255, 193, 7, 0.3);
        }
  
        .selected-day-info h4 {
          color: #000;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }
  
        .selected-day-info p {
          color: rgba(0, 0, 0, 0.7);
          font-size: 14px;
          margin: 0;
        }
  
        .selected-day-stats {
          display: flex;
          gap: 24px;
        }
  
        .day-stat-item {
          text-align: center;
        }
  
        .day-stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #000;
          margin: 0;
        }
  
        .day-stat-label {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.7);
          text-transform: uppercase;
          font-weight: 600;
          margin: 0;
        }
  
        /* Booking Cards */
        .booking-card {
          background: #242424;
          border: 2px solid #2a2a2a;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }
  
        .booking-card:hover {
          border-color: #ffc107;
          box-shadow: 0 8px 24px rgba(255, 193, 7, 0.2);
          transform: translateY(-2px);
        }
  
        .booking-card.expanded {
          border-color: #ffc107;
          background: #1f1f1f;
          box-shadow: 0 8px 24px rgba(255, 193, 7, 0.3);
        }
  
        .booking-header {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: start;
        }
  
        .booking-main-info {
          display: grid;
          gap: 16px;
        }
  
        .booking-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
  
        .section-label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
  
        .section-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
  
        .booking-id {
          font-size: 13px;
          color: #ffc107;
          font-weight: 600;
        }
  
        .booking-name {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }
  
        .booking-contact {
          font-size: 14px;
          color: #999;
          display: flex;
          align-items: center;
          gap: 8px;
        }
  
        .booking-contact svg {
          color: #666;
          flex-shrink: 0;
        }
  
        .kid-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
  
        .kid-name {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
        }
  
        .kid-level {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
  
        .booking-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding-top: 12px;
          border-top: 1px solid #2a2a2a;
        }
  
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #999;
        }
  
        .meta-item svg {
          color: #666;
        }
  
        .amount-highlight {
          color: #00c853;
          font-weight: 700;
          font-size: 15px;
        }
  
        .booking-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }
  
        .expand-icon {
          color: #ffc107;
          transition: transform 0.3s ease;
          font-size: 20px;
        }
  
        .booking-card.expanded .expand-icon {
          transform: rotate(90deg);
        }
  
        .booking-details {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #2a2a2a;
        }
  
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
  
        .details-header h6 {
          color: #ffc107;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }
  
        .session-count-badge {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
  
        .session-list {
          display: grid;
          gap: 12px;
        }
  
        .session-item {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 16px 20px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          transition: all 0.2s ease;
        }
  
        .session-item:hover {
          border-color: #ffc107;
          background: #242424;
        }
  
        .session-info h6 {
          color: #ffc107;
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 6px 0;
        }
  
        .session-info p {
          color: #999;
          font-size: 13px;
          margin: 0;
          line-height: 1.5;
        }
  
        .session-check {
          width: 32px;
          height: 32px;
          background: rgba(0, 200, 83, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00c853;
          font-size: 16px;
        }
  
        .booking-summary {
          margin-top: 24px;
          padding: 20px;
          background: #242424;
          border-radius: 12px;
          border: 1px solid #2a2a2a;
        }
  
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
  
        .summary-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
  
        .summary-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }
  
        .summary-value {
          font-size: 16px;
          color: #fff;
          font-weight: 600;
        }
  
        .summary-value.highlight {
          color: #00c853;
          font-size: 24px;
          font-weight: 700;
        }
  
        .badge {
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
  
        .badge-success {
          background: linear-gradient(135deg, #00c853, #00e676);
          color: #fff;
          box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);
        }
  
        .badge-danger {
          background: linear-gradient(135deg, #ff5252, #ff1744);
          color: #fff;
          box-shadow: 0 4px 12px rgba(255, 82, 82, 0.3);
        }
  
        .badge-warning {
          background: linear-gradient(135deg, #ffc107, #ffb300);
          color: #000;
        }
  
        .badge-primary {
          background: linear-gradient(135deg, #2196f3, #1976d2);
          color: #fff;
        }
  
        /* Forms */
        .form-select, .form-control {
          background: #242424;
          border: 1px solid #333;
          color: #fff;
          border-radius: 8px;
          padding: 10px 14px;
        }
  
        .form-select:focus, .form-control:focus {
          background: #242424;
          border-color: #ffc107;
          color: #fff;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
        }
  
        .form-label {
          color: #999;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 6px;
        }
  
        .btn-warning {
          background: linear-gradient(135deg, #ffc107, #ffb300);
          border: none;
          color: #000;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 8px;
        }
  
        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 193, 7, 0.4);
        }
  
        .btn-outline-warning {
          border: 2px solid #ffc107;
          color: #ffc107;
          background: transparent;
          font-weight: 600;
          padding: 8px 20px;
          border-radius: 8px;
        }
  
        .btn-outline-warning:hover {
          background: #ffc107;
          color: #000;
        }
  
        /* Table Styles */
        .table {
          color: #fff;
          margin-bottom: 0;
          width: 100%;
        }
  
        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }
  
        .table thead th {
          background: #242424;
          border-color: #333;
          color: #ffc107;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          padding: 16px 12px;
          white-space: nowrap;
        }
  
        .table tbody tr {
          border-color: #2a2a2a;
          transition: all 0.2s ease;
        }
  
        .table tbody tr:hover {
          background: rgba(255, 193, 7, 0.05);
        }
  
        .table tbody td {
          padding: 14px 12px;
          border-color: #2a2a2a;
          vertical-align: middle;
          white-space: nowrap;
        }
  
        /* Pagination */
        .page-link {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #ffc107;
        }
  
        .page-link:hover {
          background: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
          color: #ffc107;
        }
  
        .page-item.active .page-link {
          background: #ffc107;
          border-color: #ffc107;
          color: #000;
        }
  
        .page-item.disabled .page-link {
          background: #1a1a1a;
          border-color: #2a2a2a;
          color: #666;
        }
  
        /* Mobile Responsive Styles */
        @media (max-width: 992px) {
          .mobile-menu-btn {
            display: flex;
          }
  
          .main-wrapper {
            margin-left: 0;
            width: 100%;
          }
  
          .sidebar {
            transform: translateX(-100%);
          }
  
          .sidebar.open {
            transform: translateX(0);
          }
  
          .sidebar-close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
  
          .main-header {
            padding: 16px 20px;
          }
  
          .header-title {
            font-size: 22px;
          }
  
          .main-content {
            padding: 20px 16px;
            overflow-x: hidden;
          }
  
          .content-card {
            padding: 20px;
            overflow-x: auto;
          }
  
          .stat-value {
            font-size: 24px;
          }
  
          .booking-card {
            padding: 20px;
            width: 100%;
          }
  
          .booking-header {
            grid-template-columns: 1fr;
          }
  
          .booking-actions {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
  
          .selected-day-banner {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
  
          .selected-day-stats {
            width: 100%;
            justify-content: space-around;
          }
  
          .table-responsive {
            margin: 0 -20px;
            padding: 0 20px;
          }
  
          .row {
            margin: 0 -8px;
          }
  
          .row > * {
            padding: 0 8px;
          }
        }
  
        @media (max-width: 576px) {
          .main-header {
            padding: 12px 16px;
          }
  
          .header-title {
            font-size: 18px;
          }
  
          .main-content {
            padding: 16px 8px;
          }
  
          .content-card {
            padding: 16px 12px;
          }
  
          .stat-card-body {
            padding: 16px;
          }
  
          .booking-card {
            padding: 16px;
          }
  
          .booking-name {
            font-size: 18px;
          }
  
          .session-item {
            grid-template-columns: 1fr;
            gap: 12px;
          }
  
          .session-check {
            justify-self: end;
          }
  
          .summary-grid {
            grid-template-columns: 1fr;
          }
  
          .table thead th {
            padding: 12px 8px;
            font-size: 11px;
          }
  
          .table tbody td {
            padding: 12px 8px;
          }
  
          .row {
            margin: 0 -4px;
          }
  
          .row > * {
            padding: 0 4px;
          }
        }
  
        .spinner-border {
          border-color: #ffc107;
          border-right-color: transparent;
        }
  
        .search-box {
          position: relative;
        }
  
        .search-box input {
          padding-left: 40px;
        }
  
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }
  
        .filter-section {
          background: #242424;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid #2a2a2a;
          overflow-x: auto;
        }
  
        .dropdown-menu {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
        }
  
        .dropdown-item {
          color: #fff;
          padding: 10px 16px;
        }
  
        .dropdown-item:hover {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }
  
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
  
        .empty-state-icon {
          font-size: 64px;
          color: #666;
          margin-bottom: 20px;
        }
  
        .empty-state-text {
          color: #999;
          font-size: 16px;
        }


        
        // Replace the previous booking card styles with these updated ones:

      /* UPDATED: Better aligned booking card styles */
      .booking-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 8px;
      }

      .booking-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .section-label {
        font-size: 11px;
        color: #666;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }

      .section-content {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .info-row {
        display: grid;
        grid-template-columns: 16px auto 1fr auto;
        gap: 8px;
        align-items: center;
        padding: 4px 0;
      }

      .info-icon {
        color: #666;
        justify-self: center;
      }

      .info-label {
        font-size: 12px;
        color: #999;
        font-weight: 500;
        min-width: fit-content;
      }

      .info-value {
        font-size: 13px;
        color: #fff;
        font-weight: 400;
      }

      .kid-level {
        background: rgba(255, 193, 7, 0.2);
        color: #ffc107;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        justify-self: end;
      }

      /* Emergency contact styling */
      .emergency-contact {
        cursor: pointer !important;
        background: rgba(255, 107, 107, 0.1);
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255, 107, 107, 0.3);
        transition: all 0.3s ease;
        margin: 2px 0;
      }

      .emergency-contact:hover {
        background: rgba(255, 107, 107, 0.2);
        border-color: #ff6b6b;
        transform: translateY(-1px);
      }

      .emergency-icon {
        color: #ff6b6b !important;
      }

      .emergency-label {
        color: #ff6b6b !important;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .phone-clickable {
        color: #4CAF50 !important;
        font-weight: 600;
        cursor: pointer;
        text-decoration: underline;
        transition: all 0.2s ease;
      }

      .phone-clickable:hover {
        color: #45a049 !important;
      }

      /* Medical alert section */
      .medical-alert {
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(255, 179, 71, 0.15));
        border: 1px solid rgba(255, 107, 107, 0.4);
        border-left: 4px solid #ff6b6b;
        border-radius: 8px;
        padding: 12px;
        margin: 12px 0;
      }

      .medical-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
        color: #ff6b6b;
        font-weight: 600;
        font-size: 13px;
      }

      .medical-title {
        flex: 1;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .medical-content {
        color: #ffcccb;
        font-size: 14px;
        line-height: 1.4;
        padding-left: 22px;
      }

      /* Summary section improvements */
      .summary-title {
        color: #ffc107;
        font-size: 16px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0 0 16px 0;
        padding-bottom: 8px;
        border-bottom: 2px solid rgba(255, 193, 7, 0.3);
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .summary-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 12px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      }

      .summary-item:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 193, 7, 0.3);
      }

      .medical-summary-item {
        border-color: rgba(255, 107, 107, 0.4) !important;
        background: rgba(255, 107, 107, 0.1) !important;
      }

      .total-item {
        border-color: rgba(0, 200, 83, 0.4) !important;
        background: rgba(0, 200, 83, 0.1) !important;
      }

      .summary-label {
        font-size: 11px;
        color: #666;
        text-transform: uppercase;
        font-weight: 600;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
      }

      .summary-value {
        font-size: 14px;
        color: #fff;
        font-weight: 500;
        word-break: break-word;
      }

      .summary-value.highlight {
        color: #00c853;
        font-size: 20px;
        font-weight: 700;
      }

      .medical-highlight {
        color: #ff6b6b !important;
        font-weight: 600;
      }

      /* Mobile responsive adjustments */
      @media (max-width: 768px) {
        .booking-info-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .info-row {
          grid-template-columns: 16px auto 1fr;
          gap: 6px;
        }

        .kid-level {
          justify-self: start;
          margin-top: 4px;
        }

        .summary-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 576px) {
        .info-row {
          grid-template-columns: 1fr;
          gap: 4px;
          padding: 6px 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          margin: 2px 0;
        }

        .info-icon {
          display: none;
        }

        .info-label {
          font-weight: 600;
          color: #ffc107;
        }

        .medical-header {
          flex-wrap: wrap;
        }

        .medical-content {
          padding-left: 0;
        }
      }


        
      `}</style>
    );
  }
  