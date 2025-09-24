export default function CostCard() {
    return (
      <div className="container my-4">
        <div className="card border-warning shadow">
          <div className="card-body row text-center">
            <div className="col-md-6">
              <h5 className="fw-bold">10 sessions</h5>
              <p className="fs-4 text-warning">£350</p>
            </div>
            <div className="col-md-6">
              <h5 className="fw-bold">Per session</h5>
              <p className="fs-4 text-warning">£40</p>
            </div>
            <p className="mt-3 text-muted">
              Save when you book the full block!
            </p>
          </div>
        </div>
      </div>
    );
  }
  