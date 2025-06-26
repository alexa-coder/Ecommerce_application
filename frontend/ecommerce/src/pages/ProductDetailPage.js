import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, rateProduct } from '../api/products';
import { addToCart, getCart } from '../api/orders';
import ReactImageMagnify from 'react-image-magnify';
import StarRating from '../components/StarRating';
import ShareButton from '../components/ShareButton';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const { user } = useAuth();
    const [hasRated, setHasRated] = useState(false);
    const [showSpinner, setShowSpinner] = useState(true);
    const { updateCartCount } = useCart();

    useEffect(() => {
        const MIN_LOADING_TIME = 1000;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setShowSpinner(true);
                setUserRating(0);
                setHasRated(false);

                const timer = setTimeout(() => {
                    setShowSpinner(false);
                }, MIN_LOADING_TIME);

                const response = await getProduct(id);
                setProduct(response.data);
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
        fetchProduct();
    }, [id, user]);

    const handleAddToCart = async () => {
        try {
            await addToCart(id);
            const cartResponse = await getCart();
            updateCartCount(cartResponse.data.items.length);
            alert('Product added to cart!');
        } catch (err) {
            console.error(err);
            alert('Failed to add product to cart');
        }
    };

    const handleRating = async (rating) => {
        if (!user) {
            alert('Please login to rate products');
            return;
        }
        if (hasRated) {
            alert('You have already rated this product');
            return;
        }

        try {
            await rateProduct(id, {
                rating: rating,
                product: id
            });

            setUserRating(rating);
            setHasRated(true);

            // Refresh product data
            const updatedProduct = await getProduct(id);
            setProduct(updatedProduct.data);
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
    if (!product) return <div className="text-center py-4">Product not found</div>;

    return (
        <div>
            <div className="card">
                <div className="row g-0">
                    <div className="col-md-6">
                        <div className="bg-light" style={{ height: '100%', minHeight: '400px', position: 'relative' }}>
                            <div className="position-absolute top-0 end-0 m-2">
                                <ShareButton
                                    url={`${window.location.origin}/products/${product.id}`}
                                    title={product.name}
                                />
                            </div>
                            {product.image ? (
                                <ReactImageMagnify
                                    {...{
                                        smallImage: {
                                            alt: product.name,
                                            src: product.image,
                                            width: 400,
                                            height: 400,
                                            isFluidWidth: false
                                        },
                                        largeImage: {
                                            src: product.image,
                                            width: 1200,
                                            height: 1200
                                        },
                                        enlargedImageContainerStyle: {
                                            position: 'absolute',
                                            left: 'calc(100% + 20px)',
                                            top: '0',
                                            zIndex: 1000,
                                            backgroundColor: 'white',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                                            border: '1px solid #eee'
                                        },
                                        enlargedImageContainerDimensions: {
                                            width: '400px',
                                            height: '400px'
                                        },
                                        lensStyle: {
                                            backgroundColor: 'rgba(255,255,255,0.4)',
                                            cursor: 'zoom-in'
                                        },
                                        imageStyle: {
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            maxWidth: '100%',
                                            maxHeight: '100%'
                                        }
                                    }}
                                />
                            ) : (
                                <img
                                    src="https://via.placeholder.com/600"
                                    alt={product.name}
                                    className="img-fluid p-4 object-fit-contain"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card-body p-4 h-100 d-flex flex-column">
                            <h2 className="card-title">{product.name}</h2>
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
                                    {hasRated && userRating > 0 && ` (You rated this product ${userRating} stars)`}
                                </small>
                            </div>
                            <h3 className="text-primary my-3">₹{product.price}</h3>
                            <hr />
                            <div className="mb-3">
                                <p className="text-muted mb-1">
                                    <strong>Category:</strong> {product.category?.name || 'Uncategorized'}
                                </p>
                                <p className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                                    <strong>Availability:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </p>
                            </div>
                            <button
                                className={`btn btn-primary btn-lg ${product.stock <= 0 ? 'disabled' : ''}`}
                                onClick={handleAddToCart}
                            >
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='pt-50'>
                <h5 className='fs-5 fw-bold'>
                    Product Description
                </h5>
                <p className="card-text flex-grow-1">{product.description}</p>
            </div>
        </div>
    );
};

export default ProductDetailPage;