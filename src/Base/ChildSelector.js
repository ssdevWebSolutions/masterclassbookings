export default function ChildSelector() {
    return (
      <div className="container my-3">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <select className="form-select w-auto">
            <option>Select child</option>
          </select>
          <button className="btn btn-warning text-black fw-bold">
            Add new child
          </button>
        </div>
      </div>
    );
  }
  