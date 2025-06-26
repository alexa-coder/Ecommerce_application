import { useEffect, useState } from 'react';
import { getOrders } from '../api/orders';
import { Link } from 'react-router-dom';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const MIN_LOADING_TIME = 1000;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setShowSpinner(true);
        const timer = setTimeout(() => {
          setShowSpinner(false);
        }, MIN_LOADING_TIME);
        const response = await getOrders();
        setOrders(response.data);
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME));
        clearTimeout(timer);
        setShowSpinner(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading || showSpinner) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-grow text-primary mx-1" style={{ animationDelay: '0.1s' }} role="status"></div>
      <div className="spinner-grow text-danger mx-1" style={{ animationDelay: '0.3s' }} role="status"></div>
      <div className="spinner-grow text-warning mx-1" style={{ animationDelay: '0.5s' }} role="status"></div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Orders</h2>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user.username}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${order.status === 'P' ? 'bg-warning text-dark' :
                    order.status === 'C' ? 'bg-success' : 'bg-danger'
                    }`}>
                    {order.status === 'P' ? 'Pending' :
                      order.status === 'C' ? 'Completed' : 'Failed'}
                  </span>
                </td>
                <td>₹{order.total}</td>
                <td>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="bi bi-eye"></i> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;