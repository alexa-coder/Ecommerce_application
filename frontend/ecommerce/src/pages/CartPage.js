import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem } from '../api/orders';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        setCart(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(itemId, newQuantity);
      const response = await getCart();
      setCart(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      const response = await getCart();
      setCart(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (!cart || cart.items.length === 0) return <div className="text-center py-4">Your cart is empty</div>;

  const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div>
      <h2 className="mb-4">Your Cart</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th className="text-end">Price</th>
              <th className="text-end">Quantity</th>
              <th className="text-end">Subtotal</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product.name}</td>
                <td className="text-end">₹{item.product.price}</td>
                <td className="text-end">
                  <input
                    type="number"
                    className="form-control form-control-sm d-inline-block text-end"
                    style={{ width: '70px' }}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    min="1"
                  />
                </td>
                <td className="text-end">₹{(item.product.price * item.quantity).toFixed(2)}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="3" className="text-end">Total:</th>
              <th className="text-end">₹{total.toFixed(2)}</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="text-end">
        <Link to="/checkout" className="btn btn-primary">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;