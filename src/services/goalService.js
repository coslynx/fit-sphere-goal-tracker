/**
 * @module GoalService
 * @description Provides asynchronous functions for interacting with the backend API to manage user fitness goals.
 */

import { get, post, put, del } from './api.js';
import { sanitizeData } from './api.js';

/**
 * @async
 * @function createGoal
 * @description Sends a POST request to `/api/goals` to create a new fitness goal.
 * @param {object} goalData - An object containing goal details such as name, description, target, and unit of measure.
 * @returns {Promise<object>} A promise that resolves with the newly created goal object on success.
 * @throws {Error} If the goal creation fails due to network issues, invalid goal data, or server errors.
 */
const createGoal = async (goalData) => {
    try {
        // Validate goal data
        if (!goalData.name || !goalData.description || !goalData.target || !goalData.unit) {
            throw new Error('Missing required fields for goal creation.');
        }

        // Sanitize goal name and description to prevent injection attacks
        goalData.name = sanitizeData(goalData.name);
        goalData.description = sanitizeData(goalData.description);

        // Send POST request to the /api/goals endpoint
        const response = await post('/api/goals', goalData);

        // Check if the goal creation was successful (status code 201)
        if (response && response.statusCode === 201) {
            // Validate response data
            // if (!validateResponseData(response.data)) {
            //     throw new Error('Invalid response data received from the server.');
            // }

            return response.data; // Return the newly created goal object
        } else {
            // Handle unexpected status codes
            throw new Error(`Goal creation failed with status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.error('Goal creation failed:', error);
        throw error; // Re-throw the error with additional context
    }
};

/**
 * @async
 * @function getGoals
 * @description Sends a GET request to `/api/goals` to retrieve all fitness goals for the authenticated user.
 * @returns {Promise<array>} A promise that resolves with an array of goal objects on success.
 * @throws {Error} If the goal retrieval fails due to network issues, authorization problems, or server errors.
 */
const getGoals = async () => {
    try {
        // Send GET request to the /api/goals endpoint
        const response = await get('/api/goals');

        // Check if the goal retrieval was successful (status code 200)
        if (response && response.statusCode === 200) {
            // Validate response data
            // if (!validateResponseData(response.data)) {
            //     throw new Error('Invalid response data received from the server.');
            // }

            return response.data; // Return an array of goal objects
        } else {
            // Handle unexpected status codes
            throw new Error(`Goal retrieval failed with status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.error('Goal retrieval failed:', error);
        throw error; // Re-throw the error with additional context
    }
};

/**
 * @async
 * @function updateGoal
 * @description Sends a PUT request to `/api/goals/{goalId}` to update an existing fitness goal.
 * @param {string} goalId - The unique identifier of the goal.
 * @param {object} goalData - An object containing the updated goal details.
 * @returns {Promise<object>} A promise that resolves with the updated goal object on success.
 * @throws {Error} If the goal update fails due to network issues, authorization problems, invalid goal data, or server errors.
 */
const updateGoal = async (goalId, goalData) => {
    try {
        // Validate goal ID
        if (!goalId) {
            throw new Error('Goal ID is required for updating a goal.');
        }

        // Validate goal data
        if (!goalData.name || !goalData.description || !goalData.target || !goalData.unit) {
            throw new Error('Missing required fields for goal update.');
        }

        // Sanitize goal name and description to prevent injection attacks
        goalData.name = sanitizeData(goalData.name);
        goalData.description = sanitizeData(goalData.description);

        // Send PUT request to the /api/goals/{goalId} endpoint
        const response = await put(`/api/goals/${goalId}`, goalData);

        // Check if the goal update was successful (status code 200)
        if (response && response.statusCode === 200) {
            // Validate response data
            // if (!validateResponseData(response.data)) {
            //     throw new Error('Invalid response data received from the server.');
            // }

            return response.data; // Return the updated goal object
        } else {
            // Handle unexpected status codes
            throw new Error(`Goal update failed with status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.error('Goal update failed:', error);
        throw error; // Re-throw the error with additional context
    }
};

/**
 * @async
 * @function deleteGoal
 * @description Sends a DELETE request to `/api/goals/{goalId}` to delete a fitness goal.
 * @param {string} goalId - The unique identifier of the goal.
 * @returns {Promise<string>} A promise that resolves with a success message on successful deletion.
 * @throws {Error} If the goal deletion fails due to network issues, authorization problems, or server errors.
 */
const deleteGoal = async (goalId) => {
    try {
        // Validate goal ID
        if (!goalId) {
            throw new Error('Goal ID is required for deleting a goal.');
        }

        // Send DELETE request to the /api/goals/{goalId} endpoint
        const response = await del(`/api/goals/${goalId}`);

        // Check if the goal deletion was successful (status code 200)
        if (response && response.statusCode === 200) {
            return 'Goal deleted successfully.'; // Return a success message
        } else {
            // Handle unexpected status codes
            throw new Error(`Goal deletion failed with status code: ${response.statusCode}`);
        }
    } catch (error) {
        console.error('Goal deletion failed:', error);
        throw error; // Re-throw the error with additional context
    }
};

export { createGoal, getGoals, updateGoal, deleteGoal };