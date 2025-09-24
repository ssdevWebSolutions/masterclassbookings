export default function Calendar() {
    return (
      <div className="container my-3">
        <div className="border rounded p-3 bg-light">
          <h6 className="fw-bold">January</h6>
          <div className="d-flex justify-content-between text-muted">
            <span>S</span><span>M</span><span>T</span>
            <span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="d-flex flex-wrap mt-2">
            {Array.from({ length: 31 }, (_, i) => (
              <div
                key={i}
                className="text-center border rounded p-1"
                style={{ width: "14.2%" }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  