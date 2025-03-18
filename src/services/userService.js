/**
 * @module UserService
 * @description Provides asynchronous functions for managing user profile data.
 */

import { get, put } from './api.js';
import { sanitizeData } from './api.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * @async
 * @function getUserProfile
 * @description Retrieves a user profile by user ID.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<object>} A promise that resolves with the user profile object.
 * @throws {Error} If the user retrieval fails due to network issues, user not found, or server errors.
 */
const getUserProfile = async (userId) => {
    try {
        // Validate user ID
        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            throw new Error('User ID must be a non-empty string.');
        }

        // Send GET request to the /api/users/{userId} endpoint
        const response = await get(`/api/users/${userId}`);

        // Check if the user retrieval was successful (status code 200)
        if (response && response.statusCode === 200) {
            return response.data; // Return the user profile object
        } else if (response && response.statusCode === 404) {
            throw new Error('User not found.');
        } else {
            // Handle unexpected status codes
            throw new Error(`User retrieval failed with status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.error('User retrieval failed:', error);
        throw error; // Re-throw the error with additional context
    }
};

/**
 * @async
 * @function updateUserProfile
 * @description Updates a user profile by user ID.
 * @param {string} userId - The unique identifier of the user.
 * @param {object} userData - An object containing the updated user details.
 * @returns {Promise<object>} A promise that resolves with the updated user profile object.
 * @throws {Error} If the user update fails due to network issues, authorization problems, invalid user data, or server errors.
 */
const updateUserProfile = async (userId, userData) => {
    try {
        // Validate user ID
        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            throw new Error('User ID must be a non-empty string.');
        }

        // Validate user data
        if (!userData || typeof userData !== 'object' || Object.keys(userData).length === 0) {
            throw new Error('User data must be a non-empty object.');
        }

        // Sanitize user data to prevent XSS attacks
        const sanitizedData = sanitizeData(userData);

        // Sanitize email and username if present
        if (sanitizedData.email) {
            sanitizedData.email = sanitizeData(sanitizedData.email);
        }
        if (sanitizedData.username) {
            sanitizedData.username = sanitizeData(sanitizedData.username);
        }

        // Send PUT request to the /api/users/{userId} endpoint
        const response = await put(`/api/users/${userId}`, sanitizedData);

        // Check if the user update was successful (status code 200)
        if (response && response.statusCode === 200) {
            return response.data; // Return the updated user profile object
        } else {
            // Handle unexpected status codes
            throw new Error(`User update failed with status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.error('User update failed:', error);
        throw error; // Re-throw the error with additional context
    }
};

export { getUserProfile, updateUserProfile };