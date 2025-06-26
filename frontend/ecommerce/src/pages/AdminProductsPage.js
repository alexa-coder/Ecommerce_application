import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../api/products';
import { Link, useNavigate } from 'react-router-dom';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const MIN_LOADING_TIME = 1000;
        const fetchProducts = async () => {
            try {
                setShowSpinner(true);
                setLoading(true);
                const timer = setTimeout(() => {
                    setShowSpinner(false);
                }, MIN_LOADING_TIME);
                const response = await getProducts();
                setProducts(response.data);
                await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME));
                clearTimeout(timer);
                setShowSpinner(false);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                setProducts(products.filter(product => product.id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

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
                <h2>Manage Products</h2>
                <Link to="/admin/products/new" className="btn btn-primary">
                    Add Product
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>₹{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                    >
                                        <i className="bi bi-pencil"></i> Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <i className="bi bi-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductsPage;