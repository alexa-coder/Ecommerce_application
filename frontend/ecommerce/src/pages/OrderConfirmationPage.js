import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const { id } = useParams();

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6 text-center">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <h2 className="mb-4">Order Confirmation</h2>
                            <div className="mb-4">
                                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <p className="lead mb-4">
                                Thank you for your order! Your order number is <strong>#{id}</strong>.
                            </p>
                            <Link to="/" className="btn btn-primary px-4 py-2">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;