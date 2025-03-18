import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm.jsx';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

/**
 * @function Home
 * @description Displays the landing page for non-authenticated users, providing a welcome message and options to log in or register.
 * @returns {JSX.Element} The home component.
 */
const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto py-8 px-4">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-md">
                        <h1 className="text-3xl font-bold text-center mb-4">
                            Welcome to FitTracker!
                        </h1>
                        <p className="text-gray-700 text-center mb-6">
                            Track your fitness goals and share your achievements with friends.
                        </p>
                        <AuthForm type="login" />
                        <div className="text-center mt-4">
                            New to FitTracker? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;