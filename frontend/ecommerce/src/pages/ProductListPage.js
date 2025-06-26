import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct, getProducts, rateProduct } from '../api/products';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const { user } = useAuth();
  const { id } = useParams();
  const [hasRated, setHasRated] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const MIN_LOADING_TIME = 1000;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setShowSpinner(true);

        const timer = setTimeout(() => {
          setShowSpinner(false);
        }, MIN_LOADING_TIME);

        const response = await getProducts();
        setProducts(response.data);
        if (user) {
          const userRating = response.data.ratings?.find(r => r.user?.id === user.id);
          if (userRating) setUserRating(userRating.rating);
          setHasRated(true);
        }
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
  }, [user]);

  const handleRating = async (rating) => {
    if (!user) {
      alert('Please login to rate products');
      return;
    }

    try {
      const response = await rateProduct(id, {
        rating: rating,
        product: id  // Explicitly include product ID
      });

      setUserRating(rating);
      setHasRated(true);

      // Refresh product data
      const updatedProduct = await getProduct(id);
      setProducts(updatedProduct.data);
    } catch (err) {
      console.error('Rating failed:', err.response?.data || err.message);
      alert('Failed to submit rating. Please try again.');
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
    <div>
      <h2 className="mb-4">Products</h2>
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-12 col-sm-6 col-md-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <div className="ratio ratio-1x1 bg-light">
                <img
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="card-img-top p-2 object-fit-contain"
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate">{product.name}</h5>
                <div className='d-flex align-items-center justify-content-between'>
                  <h6 className="text-primary mb-3">MRP: ₹{product.price}</h6>
                  <div className="d-flex align-items-center mb-3">
                    <StarRating
                      rating={product.average_rating || 0}
                      productId={product.id}
                      interactive={!hasRated}
                      userRating={userRating}
                      onRate={handleRating}
                    />
                    <small className="text-muted ms-2">
                      ({product.ratings?.length || 0} reviews)
                    </small>
                  </div>
                </div>
                <Link
                  to={`/products/${product.id}`}
                  className="btn btn-primary mt-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;