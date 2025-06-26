import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orders';

const CheckoutPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await createOrder();
            navigate(`/order-confirmation/${response.data.id}`);
        } catch (err) {
            setError('Checkout failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Checkout</h2>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <h5 className="mb-3">Shipping Information</h5>

                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="fullName"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        id="address"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="city"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Processing...
                                        </>
                                    ) : 'Place Order'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;