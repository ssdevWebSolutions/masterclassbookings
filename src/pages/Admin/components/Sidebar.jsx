import { FaChartLine, FaTimes, FaCalendarAlt, FaList, FaUser, FaChevronDown, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar({ 
  activeNav, 
  sidebarOpen, 
  profileDropdownOpen, 
  onNavSwitch, 
  onCloseSidebar, 
  onProfileDropdownToggle, 
  onLogout 
}) {
  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">
          <FaChartLine />
          Admin Panel
        </h1>
        <button 
          className="sidebar-close-btn"
          onClick={onCloseSidebar}
          aria-label="Close sidebar"
        >
          <FaTimes />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeNav === "Sessions" ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavSwitch("Sessions"); }}
          >
            <FaCalendarAlt />
            Sessions Management
          </a>
        </div>
        <div className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeNav === "Bookings" ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavSwitch("Bookings"); }}
          >
            <FaList />
            Bookings Overview
          </a>
        </div>
        <div className="nav-item">
          <a
            href="#"
            className={`nav-link ${activeNav === "Bookings" ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavSwitch("Bookings"); }}
          >
            <FaList />
            Bookings 
          </a>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile" onClick={onProfileDropdownToggle}>
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-info">
            <p className="user-name">Admin</p>
            <p className="user-role">Administrator</p>
          </div>
          <FaChevronDown style={{ color: '#999', fontSize: '14px' }} />
        </div>
        {profileDropdownOpen && (
          <div className="mt-2">
            <button 
              className="btn btn-outline-warning w-100"
              onClick={onLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
