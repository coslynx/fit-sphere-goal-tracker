import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext({
    isLoggedIn: false,
    user: null,
    token: null,
    login: (token, userData) => {},
    logout: () => {},
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

// Function to sanitize user data
const sanitizeUserData = (userData) => {
    const sanitizedUser = { ...userData };
    if (sanitizedUser.email) {
        sanitizedUser.email = sanitizedUser.email.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
    }
    if (sanitizedUser.username) {
        sanitizedUser.username = sanitizedUser.username.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
    }
    return sanitizedUser;
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Retrieve token and user from localStorage
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                const sanitizedData = sanitizeUserData(userData);

                setToken(storedToken);
                setUser(sanitizedData);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                // Handle the error, possibly by logging the user out
                logoutHandler();
            }
        }
        setIsLoading(false);
    }, []);

    const loginHandler = (token, userData) => {
        const sanitizedData = sanitizeUserData(userData);
        setToken(token);
        setUser(sanitizedData);
        setIsLoggedIn(true);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(sanitizedData));
    };

    const logoutHandler = () => {
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    };

    const contextValue = {
        isLoggedIn,
        user,
        token,
        login: loginHandler,
        logout: logoutHandler,
        isLoading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};