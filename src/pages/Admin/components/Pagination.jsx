export default function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, setItemsPerPage, totalItems }) {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    return (
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center mt-4 gap-3">
        <div className="d-flex align-items-center">
          <label className="me-2 text-muted small">Show:</label>
          <select 
            className="form-select form-select-sm" 
            style={{ width: '80px' }}
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              onPageChange(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
          </select>
        </div>
        
        <div className="text-muted small">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>
  
        {totalPages > 1 && (
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
              </li>
              
              {pages.map(page => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => onPageChange(page)}>
                    {page}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    );
  }
  