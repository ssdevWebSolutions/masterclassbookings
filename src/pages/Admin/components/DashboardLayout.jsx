export default function DashboardLayout({ sidebar, header, children, sidebarOpen, onOverlayClick }) {
    return (
      <div className="dashboard-layout">
        {/* Sidebar Overlay */}
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={onOverlayClick}
        />
  
        {/* Sidebar */}
        {sidebar}
  
        {/* Main Content */}
        <div className="main-wrapper">
          {/* Header */}
          {header}
  
          {/* Main Content */}
          <main className="main-content">
            {children}
          </main>
        </div>
      </div>
    );
  }
  