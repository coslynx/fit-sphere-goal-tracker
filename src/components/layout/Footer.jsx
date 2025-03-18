import React from 'react';
import PropTypes from 'prop-types';

/**
 * @function Footer
 * @description Displays a static footer at the bottom of the application layout, containing copyright information.
 * @returns {JSX.Element} The footer component.
 */
const Footer = () => {
    let currentYear;

    try {
        currentYear = new Date().getFullYear();
    } catch (error) {
        console.error('Error generating current year:', error);
        currentYear = '2024'; // Provide a default year in case of error
    }

    return (
        <footer className="bg-gray-100 text-gray-700 py-3 text-center border-t border-gray-200">
            <p>
                © {currentYear} FitTracker. All rights reserved.
            </p>
        </footer>
    );
};

Footer.propTypes = {
    /**
     *  Warns if any prop is passed to the Footer component.
     */
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
};

Footer.defaultProps = {
    children: undefined,
    className: undefined,
    style: undefined,
};

if (process.env.NODE_ENV !== 'production') {
    Footer.propTypes = {
        children: (props, propName, componentName) => {
            if (props[propName] !== undefined) {
                return new Error(
                    `Unexpected prop \`${propName}\` passed to \`${componentName}\`. This component does not accept any props.`
                );
            }
        },
        className: (props, propName, componentName) => {
            if (props[propName] !== undefined) {
                return new Error(
                    `Unexpected prop \`${propName}\` passed to \`${componentName}\`. This component does not accept any props.`
                );
            }
        },
        style: (props, propName, componentName) => {
            if (props[propName] !== undefined) {
                return new Error(
                    `Unexpected prop \`${propName}\` passed to \`${componentName}\`. This component does not accept any props.`
                );
            }
        },
    };
}

export default Footer;

/**
 * Basic Test Case:
 *
 * // Test: Footer component renders without errors
 * import { render } from '@testing-library/react';
 * import Footer from './Footer';
 *
 * it('renders without crashing', () => {
 *   render(<Footer />);
 * });
 */