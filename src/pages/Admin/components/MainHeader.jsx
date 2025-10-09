import { FaBars } from "react-icons/fa";

export default function MainHeader({ activeNav, onMenuToggle }) {
  return (
    <header className="main-header">
      <button 
        className="mobile-menu-btn"
        onClick={onMenuToggle}
        aria-label="Open sidebar"
      >
        <FaBars size={20} />
      </button>
      <h1 className="header-title">
        {activeNav === "Sessions" ? "Sessions Management" : "Bookings Overview"}
      </h1>
      <div style={{ width: '44px', flexShrink: 0 }}></div>
    </header>
  );
}
