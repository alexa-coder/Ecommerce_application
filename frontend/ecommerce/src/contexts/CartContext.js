import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCart } from '../api/orders';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const { user } = useAuth();

    const fetchCartCount = async () => {
        if (user) {
            try {
                const response = await getCart();
                setCartCount(response.data.items.length);
            } catch (err) {
                console.error(err);
            }
        } else {
            setCartCount(0);
        }
    };

    useEffect(() => {
        fetchCartCount();
    }, [user]);

    const updateCartCount = (count) => {
        setCartCount(count);
    };

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);