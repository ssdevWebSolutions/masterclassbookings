export default function StatCard({ title, value, subtitle, icon, color, delay = 0 }) {
    return (
      <div className={`col-lg-3 col-md-6 col-sm-6 mb-3`}>
        <div className="stat-card h-100">
          <div className="stat-card-body">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="stat-icon" style={{ background: `${color}20`, color }}>
                {icon}
              </div>
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-title">{title}</div>
            <div className="stat-subtitle">{subtitle}</div>
          </div>
        </div>
      </div>
    );
  }
  