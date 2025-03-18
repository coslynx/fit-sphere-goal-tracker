import React from 'react';
import PropTypes from 'prop-types';

/**
 * @function Button
 * @description A reusable button component with customizable styles and event handling.
 * @param {ReactNode} children - The content to display within the button. (Required)
 * @param {function} onClick - The function to execute when the button is clicked. (Optional)
 * @param {boolean} disabled - If true, the button is disabled and cannot be clicked. (Optional, default: false)
 * @param {string} style - Additional Tailwind CSS classes to apply to the button. (Optional)
 * @returns {JSX.Element} A button element.
 *
 * @example
 * <Button onClick={() => console.log('Clicked!')}>Click me</Button>
 * <Button disabled>Submit</Button>
 * <Button style="bg-green-500 hover:bg-green-700">Save</Button>
 */
const Button = ({ children, onClick, disabled = false, style }) => {
    const baseStyles = 'rounded px-4 py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed';
    const defaultStyles = 'bg-blue-500 text-white hover:bg-blue-700';

    const combinedStyles = `${baseStyles} ${defaultStyles} ${style || ''}`;

    const handleClick = async (event) => {
        if (disabled) {
            event.preventDefault();
            return;
        }

        if (onClick) {
            try {
                await onClick(event);
            } catch (error) {
                console.error('Error during onClick event:', error);
                // Handle the error appropriately, e.g., display an error message to the user
            }
        }
    };

    return (
        <button
            className={combinedStyles}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    style: PropTypes.string,
};

export default Button;