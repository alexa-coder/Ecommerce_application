import { useEffect, useState } from 'react';
import { getOrders } from '../api/orders';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                setOrders(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-4">Loading...</div>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Order History</h2>

            {orders.length === 0 ? (
                <div className="alert alert-info">You have no orders yet.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Order #</th>
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
                                            to={`/orders/${order.id}`}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;