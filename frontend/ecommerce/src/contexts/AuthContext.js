import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../api/auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (authData) => {
        localStorage.setItem('access_token', authData.access);
        localStorage.setItem('refresh_token', authData.refresh);
        localStorage.setItem('user_data', JSON.stringify(authData.user));
        setUser(authData.user);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        const userData = JSON.parse(localStorage.getItem('user_data'));
                        if (userData) {
                            setUser(userData);
                        } else {
                            // If user data is missing but token exists, fetch profile
                            try {
                                const profileResponse = await getProfile();
                                setUser({
                                    id: profileResponse.data.id,
                                    username: profileResponse.data.username,
                                    email: profileResponse.data.email,
                                    is_admin: profileResponse.data.is_staff || false
                                });
                            } catch (err) {
                                logout();
                            }
                        }
                    }
                } catch (err) {
                    logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);