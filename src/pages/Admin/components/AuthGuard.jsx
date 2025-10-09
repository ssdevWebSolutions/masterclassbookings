import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function AuthGuard({ loginData, onLoginRoute, children }) {
  if (!loginData?.token) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}>
        <div className="text-center animate-fade-in">
          <div className="card shadow-lg border-0" style={{ maxWidth: "400px", background: "#1a1a1a" }}>
            <div className="card-body p-5">
              <FaUser className="mb-3" style={{ fontSize: "3rem", color: "#ffc107" }} />
              <h4 className="text-white mb-3">Authentication Required</h4>
              <p className="text-muted mb-4">Please login to access the admin dashboard.</p>
              <button className="btn btn-warning px-4 py-2" onClick={onLoginRoute}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loginData.role !== "ADMIN") {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)" }}>
        <div className="text-center animate-fade-in">
          <div className="card shadow-lg border-0" style={{ maxWidth: "400px", background: "#1a1a1a" }}>
            <div className="card-body p-5">
              <FaSignOutAlt className="mb-3" style={{ fontSize: "3rem", color: "#ff4444" }} />
              <h4 className="text-white mb-3">Access Denied</h4>
              <p className="text-muted mb-4">You are unauthorized to access this dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
