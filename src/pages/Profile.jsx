import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useAuth } from '../../context/AuthContext.jsx';
import { getUserProfile, updateUserProfile } from '../../services/userService.js';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';

/**
 * @function Profile
 * @description Displays the user's profile information and allows them to update it.
 * @returns {JSX.Element} A profile details form.
 */
const Profile = () => {
    const { user: authUser, token, logout, login: authLogin } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        username: '',
        email: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                if (!authUser || !authUser.id || !token) {
                    throw new Error('User ID or token is missing.');
                }

                const userProfile = await getUserProfile(authUser.id, token);

                if (!userProfile) {
                    throw new Error('Failed to fetch user profile.');
                }
                const schema = Yup.object({
                    username: Yup.string().required(),
                    email: Yup.string().email().required(),
                });

                try {
                    await schema.validate(userProfile);
                    setProfile({
                        username: DOMPurify.sanitize(userProfile.username),
                        email: DOMPurify.sanitize(userProfile.email),
                    });
                } catch (validationError) {
                    console.error('Validation error:', validationError.message);
                    setError('Invalid profile data received.');
                }

            } catch (apiError) {
                console.error('API error:', apiError);

                if (apiError.status === 401) {
                    // Unauthorized access, redirect to login
                    logout();
                    navigate('/login');
                    return; // Stop further execution
                }
                setError(apiError.message || 'Failed to fetch profile. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [authUser, token, navigate, logout]);

    const handleChange = (event) => {
        const { id, value } = event.target;
        // Sanitize the input value using DOMPurify
        const sanitizedValue = DOMPurify.sanitize(value);

        setProfile((prevProfile) => ({
            ...prevProfile,
            [id]: sanitizedValue,
        }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            if (!authUser || !authUser.id || !token) {
                throw new Error('User ID or token is missing.');
            }

            // Validate the profile data before sending it to the backend
            const schema = Yup.object({
                username: Yup.string().required('Username is required'),
                email: Yup.string().email('Invalid email').required('Email is required'),
            });

            try {
                await schema.validate({
                    username: profile.username,
                    email: profile.email,
                }, { abortEarly: false });
            } catch (validationError) {
                setError(validationError.message);
                return;
            }

            const updatedProfile = await updateUserProfile(authUser.id, {
                username: DOMPurify.sanitize(profile.username),
                email: DOMPurify.sanitize(profile.email),
            }, token);

            if (!updatedProfile) {
                throw new Error('Failed to update profile.');
            }

            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);

            // Update user data in AuthContext after successful update
            if (updatedProfile) {
                authLogin(token, { ...authUser, username: updatedProfile.username, email: updatedProfile.email });
            }

        } catch (apiError) {
            console.error('API error:', apiError);
            setError(apiError.message || 'Failed to update profile. Please try again.');

            if (apiError.status === 401) {
                // Unauthorized access, redirect to login
                logout();
                navigate('/login');
                return; // Stop further execution
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow container mx-auto py-8 px-4">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-center">Loading profile...</div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto py-8 px-4">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center mb-4">Profile Details</h2>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Error:</strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Success:</strong>
                                <span className="block sm:inline">{successMessage}</span>
                            </div>
                        )}
                        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <Input
                                id="username"
                                label="Username"
                                type="text"
                                placeholder="Enter your username"
                                value={profile.username}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="Enter your email"
                                value={profile.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                            <div className="flex items-center justify-between mt-4">
                                {isEditing ? (
                                    <>
                                        <Button onClick={handleSave} disabled={isSubmitting} style="w-1/2 mr-2">
                                            {isSubmitting ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button onClick={() => setIsEditing(false)} disabled={isSubmitting} style="w-1/2 ml-2 bg-gray-500 hover:bg-gray-700">
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)} style="w-full">
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

Profile.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }),
};

export default Profile;