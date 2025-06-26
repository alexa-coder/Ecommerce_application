import api from './api';

export const getProducts = () => api.get('/products/');
export const getProduct = (id) => api.get(`/products/${id}/`);
export const createProduct = (productData) => api.post('/products/', productData);
export const updateProduct = (id, productData) => api.put(`/products/${id}/`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}/`);
export const getCategories = () => api.get('/products/categories/');
export const rateProduct = (productId, ratingData) => {
    return api.post(`/products/${productId}/rate/`, ratingData);
};