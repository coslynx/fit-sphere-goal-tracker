import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { get, post, put, del } from './api.js';

/**
 * @module AuthService
 * @description Provides authentication services including registration, login, and logout.
 */

/**
 * @async
 * @function register
 * @description Registers a new user with the provided user data.
 * @param {object} userData - An object containing user registration details (username, email, password).
 * @returns {Promise<object>} A promise that resolves with the registered user data upon successful registration.
 * @throws {Error} If registration fails due to network errors, validation issues, or server errors.
 *
 * @example
 * authService.register({ username: 'testuser', email: 'test@example.com', password: 'password123' })
 *     .then(response => {
 *         console.log('Registration successful:', response);
 *     })
 *     .catch(error => {
 *         console.error('Registration failed:', error.message);
 *     });
 */
const register = async (userData) => {
    try {
        // Validate user data
        if (!userData.username || !userData.email || !userData.password) {
            throw new Error('Missing required fields for registration.');
        }

        // Sanitize user data
        // userData = sanitizeData(userData);

        // Send POST request to the registration endpoint
        const response = await post('/auth/register', userData);

        // Check for successful registration (status code 201)
        if (response && response.statusCode === 201) {
            const { token, user } = response.data;

            if (!token || !user) {
                throw new Error('Token or user data missing in response.');
            }

            // Access the loginHandler function from the AuthContext
            // console.log('response', response);
            return response;
        } else {
            // Handle unexpected status codes
            throw new Error(`Registration failed with status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

/**
 * @async
 * @function login
 * @description Logs in an existing user with the provided credentials.
 * @param {object} credentials - An object containing user login credentials (email, password).
 * @returns {Promise<object>} A promise that resolves with the user data upon successful login.
 * @throws {Error} If login fails due to invalid credentials, account not verified, or server errors.
 *
 * @example
 * authService.login({ email: 'test@example.com', password: 'password123' })
 *     .then(response => {
 *         console.log('Login successful:', response);
 *     })
 *     .catch(error => {
 *         console.error('Login failed:', error.message);
 *     });
 */
const login = async (credentials) => {
    try {
        // Validate credentials
        if (!credentials.email || !credentials.password) {
            throw new Error('Missing required fields for login.');
        }

        // Send POST request to the login endpoint
        const response = await post('/auth/login', credentials);

        // Check for successful login (status code 200)
        if (response && response.statusCode === 200) {
            const { token, user } = response.data;

            if (!token || !user) {
                throw new Error('Token or user data missing in response.');
            }

            // Access the loginHandler function from the AuthContext
            // loginHandler(token, user);

            return response;
        } else {
            // Handle unexpected status codes
            throw new Error(`Login failed with status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

/**
 * @async
 * @function logout
 * @description Logs out the current user by clearing the authentication context.
 * @returns {Promise<void>} A promise that resolves when the logout operation is complete.
 * @throws {Error} If logout fails due to token invalidation errors or server errors.
 *
 * @example
 * authService.logout()
 *     .then(() => {
 *         console.log('Logout successful');
 *     })
 *     .catch(error => {
 *         console.error('Logout failed:', error.message);
 *     });
 */
const logout = async () => {
    try {
        // Send GET request to the logout endpoint
        const response = await get('/auth/logout');

        // Check for successful logout (status code 200)
        if (response && response.statusCode === 200) {
            // Access the logoutHandler function from the AuthContext
            // logoutHandler();
            console.log("logout successful")
            return response
        } else {
            // Handle unexpected status codes
            throw new Error(`Logout failed with status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};

export { register, login, logout };