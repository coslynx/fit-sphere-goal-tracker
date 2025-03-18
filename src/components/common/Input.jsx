import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

/**
 * @function Input
 * @description A reusable input component with label and error message support, styled with Tailwind CSS.
 * @param {string} id - A unique identifier for the input element. (Required)
 * @param {string} label - The label text for the input field. (Optional)
 * @param {string} type - The type of input field (e.g., 'text', 'email', 'password'). Default: 'text'.
 * @param {string} value - The current value of the input field.
 * @param {function} onChange - A callback function that is called when the input value changes. (Required) Should receive the event as its argument.
 * @param {string} error - An error message to display below the input field. (Optional)
 * @param {string} placeholder - A placeholder text for the input field. (Optional)
 * @param {boolean} disabled - If true, the input field is disabled. Default: false.
 * @returns {JSX.Element} An input element with label and error message support.
 *
 * @example
 * <Input
 *   id="email"
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 *   placeholder="Enter your email"
 * />
 */
const Input = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    disabled = false,
}) => {
    const handleChange = (event) => {
        try {
            const dirtyValue = event.target.value;
            const cleanValue = DOMPurify.sanitize(dirtyValue);

            const sanitizedEvent = {
                ...event,
                target: {
                    ...event.target,
                    value: cleanValue,
                },
            };

            if (onChange) {
                onChange(sanitizedEvent);
            }
        } catch (err) {
            console.error('Error during onChange event:', err);
        }
    };

    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
    );
};

Input.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Input;