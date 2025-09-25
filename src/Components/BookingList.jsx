import { useSelector } from 'react-redux';

const BookingList = () => {
  const bookings = useSelector(state => state.bookings.bookings);
  const loading = useSelector(state => state.bookings.loading);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {bookings.map((b) => (
        <div key={b.bookingId} className="card p-3 mb-3">
          <h5>{b.kidName} ({b.kidLevel})</h5>
          <p>Parent: {b.parentName}</p>
          <p>Amount: £{b.totalAmount}</p>
          <p>Status: {b.paymentStatus ? "Paid" : "Pending"}</p>
          <ul>
            {b.sessionDetails.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
