import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';

/**
 * @function Header
 * @description Displays the application header with navigation links, adapting based on the user's authentication status.
 * @returns {JSX.Element} The header component.
 */
const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="bg-white shadow-md py-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold">
                    FitTracker
                </Link>
                <nav>
                    <ul className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <li>
                                    <Link to="/dashboard" className="hover:text-blue-500">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/profile" className="hover:text-blue-500">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Button onClick={handleLogout} style="bg-red-500 text-white hover:bg-red-700">
                                        Logout
                                    </Button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" className="hover:text-blue-500">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="hover:text-blue-500">
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

Header.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
        email: PropTypes.string,
    }),
    logout: PropTypes.func,
};

export default Header;