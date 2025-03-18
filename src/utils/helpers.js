/**
 * @module helpers
 * @description Provides utility functions for data manipulation, validation, and formatting.
 */

/**
 * @function formatDate
 * @description Converts a date string (ISO format) to a user-friendly format (e.g., "MMMM DD, YYYY").
 * @param {string} dateString - The date string in ISO format.
 * @returns {string} The formatted date string, or "Invalid Date" if the input is invalid.
 *
 * @example
 * formatDate("2024-07-22T14:30:00.000Z") // Returns "July 22, 2024"
 * formatDate("invalid-date") // Returns "Invalid Date"
 */
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return "Invalid Date";
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
    }
};

/**
 * @function validateEmail
 * @description Validates if an email address conforms to a standard email format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 *
 * @example
 * validateEmail("test@example.com") // Returns true
 * validateEmail("invalid-email") // Returns false
 */
const validateEmail = (email) => {
    if (typeof email !== 'string') {
        console.warn('validateEmail: Input is not a string.');
        return false;
    }

    const regex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
    return regex.test(email);
};

/**
 * @function truncateText
 * @description Truncates a string to a specified maximum length, adding "..." at the end if truncated.
 * @param {string} text - The string to truncate.
 * @param {number} maxLength - The maximum length of the truncated string.
 * @returns {string} The truncated string, or the original string if it is shorter than the maximum length.
 *
 * @example
 * truncateText("This is a long string", 10) // Returns "This is a..."
 * truncateText("Short string", 20) // Returns "Short string"
 */
const truncateText = (text, maxLength) => {
    if (typeof text !== 'string') {
        console.warn('truncateText: Input is not a string. Returning empty string.');
        return '';
    }

    if (typeof maxLength !== 'number' || maxLength <= 0) {
        console.warn('truncateText: Invalid maxLength. Returning original text.');
        return text;
    }

    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + "...";
};

/**
 * @function sanitizeInput
 * @description Sanitizes user input to prevent XSS attacks by escaping HTML characters.
 * @param {string} input - The string to sanitize.
 * @returns {string} The sanitized string with HTML characters escaped.
 *
 * @example
 * sanitizeInput("<script>alert('XSS')</script>") // Returns "&lt;script&gt;alert('XSS')&lt;/script&gt;"
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        console.warn('sanitizeInput: Input is not a string. Returning empty string.');
        return '';
    }

    return input.replace(/[<>&"'']/g, (char) => {
        switch (char) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '&amp;';
            case '"':
                return '&quot;';
            case "'":
                return '&#39;';
            default:
                return char;
        }
    });
};

export { formatDate, validateEmail, truncateText, sanitizeInput };