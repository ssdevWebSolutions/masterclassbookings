export default function ClassBlock({ title, dates, times, desc }) {
    return (
      <div className="container my-3">
        <h5 className="fw-bold text-warning">{title}</h5>
        <p className="mb-1">
          {dates.friday} <span className="ms-2">{times.friday}</span>
        </p>
        <p>
          {dates.sunday} <span className="ms-2">{times.sunday}</span>
        </p>
        <p className="text-muted">{desc}</p>
      </div>
    );
  }
  