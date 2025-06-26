import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">E-Commerce</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                {user.is_admin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/products">Manage Products</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/orders">Manage Orders</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">My Orders</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    Cart <span className="badge bg-light text-dark">{cartCount}</span>
                  </Link>
                </li>
                <li className="nav-item position-relative">
                  <div
                    className="nav-link d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setShowProfileTooltip(true)}
                    onMouseLeave={() => setShowProfileTooltip(false)}
                  >
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-person-fill text-primary"></i>
                    </div>
                    {showProfileTooltip && (
                      <div className="position-absolute top-100 end-0 mt-2 bg-white text-dark p-2 rounded shadow-sm"
                        style={{ zIndex: 1000, minWidth: '150px' }}>
                        <div className="text-center">
                          <p className="mb-0 fw-bold">{user.username || user.email}</p>
                          <hr className="my-1" />
                          <button
                            className="btn btn-sm btn-outline-danger w-100"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;