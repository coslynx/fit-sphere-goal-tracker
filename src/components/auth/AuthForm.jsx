import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DOMPurify from 'dompurify';
import { useAuth } from '../../context/AuthContext.jsx';
import { register, login } from '../../services/authService.js';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { sanitizeData } from '../../services/api.js';
import { sanitizeUserData } from '../../context/AuthContext.jsx';

/**
 * @function AuthForm
 * @description A reusable form component for user authentication (login and registration).
 * @param {string} type - The type of form to display ('login' or 'register'). (Required)
 * @returns {JSX.Element} An authentication form (login or registration).
 *
 * @example
 * <AuthForm type="login" />
 * <AuthForm type="register" />
 */
const AuthForm = ({ type }) => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [generalError, setGeneralError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (type !== 'login' && type !== 'register') {
        throw new Error('Invalid type prop. Must be "login" or "register".');
    }

    const isLogin = type === 'login';

    const validationSchema = isLogin
        ? Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
        })
        : Yup.object({
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .required('Username is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .required('Password is required'),
        });

    const initialValues = isLogin
        ? { email: '', password: '' }
        : { username: '', email: '', password: '' };

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsSubmitting(true);
        setGeneralError('');
        try {
            const sanitizedValues = sanitizeData({ ...values });

            if (isLogin) {
                const response = await login({
                    email: DOMPurify.sanitize(sanitizedValues.email),
                    password: DOMPurify.sanitize(sanitizedValues.password),
                });

                if (response && response.statusCode === 200) {
                    const { token, user } = response.data;

                    authLogin(token, user);
                    navigate('/dashboard');

                } else {
                    setGeneralError(response?.message || 'Login failed. Please check your credentials.');
                }

            } else {
                const response = await register({
                    username: DOMPurify.sanitize(sanitizedValues.username),
                    email: DOMPurify.sanitize(sanitizedValues.email),
                    password: DOMPurify.sanitize(sanitizedValues.password),
                });

                if (response && response.statusCode === 201) {
                    const { token, user } = response.data;
                    authLogin(token, user);

                    navigate('/dashboard');

                } else {
                    setGeneralError(response?.message || 'Registration failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Submission error:', error);
            setGeneralError(error.message || 'An unexpected error occurred.');

        } finally {
            setSubmitting(false);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                {generalError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline">{generalError}</span>
                    </div>
                )}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, values, handleChange, handleBlur }) => (
                        <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            {!isLogin && (
                                <Input
                                    id="username"
                                    label="Username"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.username && errors.username}
                                />
                            )}
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && errors.email}
                            />
                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.password && errors.password}
                            />
                            <div className="flex items-center justify-between">
                                <Button type="submit" disabled={isSubmitting} style="w-full">
                                    {isLogin ? 'Login' : 'Register'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

AuthForm.propTypes = {
    type: PropTypes.oneOf(['login', 'register']).isRequired,
};

export default AuthForm;