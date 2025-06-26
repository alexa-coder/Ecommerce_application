import api from './api';

export const getCart = () => api.get('/orders/cart/');
export const addToCart = (productId, quantity = 1) =>
  api.post('/orders/cart/add/', { product_id: productId, quantity });
export const updateCartItem = (itemId, quantity) =>
  api.put(`/orders/cart/items/${itemId}/`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/orders/cart/items/${itemId}/remove/`);
export const createOrder = () => api.post('/orders/');
export const getOrders = () => api.get('/orders/');
export const getOrder = (id) => api.get(`/orders/${id}/`);