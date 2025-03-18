import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useAuth } from '../../context/AuthContext.jsx';
import GoalCard from '../../components/goals/GoalCard.jsx';
import GoalForm from '../../components/goals/GoalForm.jsx';
import { getGoals, deleteGoal } from '../../services/goalService.js';
import Button from '../../components/common/Button.jsx';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';

/**
 * @function Dashboard
 * @description Displays the main dashboard for authenticated users, showing their fitness goals and providing an interface to manage them.
 * @returns {JSX.Element} The dashboard component.
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    const [goals, setGoals] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [deletingGoalId, setDeletingGoalId] = useState(null); // Track the ID of the goal being deleted

    useEffect(() => {
        const fetchGoals = async () => {
            setIsLoading(true);
            setError('');
            try {
                if (!user || !token) {
                    throw new Error('User or token is missing. Please login again.');
                }

                const response = await getGoals();

                if (response && response.statusCode === 200) {
                    setGoals(response.data);
                } else {
                    setError(response?.message || 'Failed to fetch goals. Please try again.');
                }
            } catch (apiError) {
                console.error('API error:', apiError);

                if (apiError.status === 401) {
                    logout();
                    navigate('/login');
                    return;
                }
                setError(apiError.message || 'Failed to fetch goals. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoals();
    }, [user, token, navigate, logout]);

    const handleGoalCreation = () => {
        setIsCreating(true);
    };

    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) {
            return;
        }

        setDeletingGoalId(goalId); // Set the ID of the goal being deleted
        setError('');

        try {
            if (!goalId) {
                throw new Error('Goal ID is missing.');
            }

            const response = await deleteGoal(goalId);

            if (response) {
                // Successfully deleted, refetch goals
                setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));

            } else {
                setError('Failed to delete goal. Please try again.');
            }
        } catch (apiError) {
            console.error('API error:', apiError);
            setError(apiError.message || 'Failed to delete goal. Please try again.');
        } finally {
            setDeletingGoalId(null); // Reset deleting state
        }
    };

    const refetchGoals = async () => {
        setIsLoading(true);
        setError('');
        try {
            if (!user || !token) {
                throw new Error('User or token is missing. Please login again.');
            }

            const response = await getGoals();

            if (response && response.statusCode === 200) {
                setGoals(response.data);
            } else {
                setError(response?.message || 'Failed to fetch goals. Please try again.');
            }
        } catch (apiError) {
            console.error('API error:', apiError);

            if (apiError.status === 401) {
                logout();
                navigate('/login');
                return;
            }
            setError(apiError.message || 'Failed to fetch goals. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto py-8 px-4">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold text-center mb-4">
                        Dashboard
                    </h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-center">Loading goals...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                {goals.map((goal) => (
                                    <div key={goal.id} className="relative">
                                        <GoalCard goal={{
                                            ...goal,
                                            name: DOMPurify.sanitize(goal.name),
                                            description: DOMPurify.sanitize(goal.description)
                                        }} />
                                        <div className="absolute top-2 right-2">
                                            <Button
                                                onClick={() => handleDeleteGoal(goal.id)}
                                                disabled={deletingGoalId === goal.id}
                                                style="bg-red-500 text-white hover:bg-red-700 text-xs"
                                            >
                                                {deletingGoalId === goal.id ? 'Deleting...' : 'Delete'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={handleGoalCreation}>
                                Create New Goal
                            </Button>
                        </>
                    )}

                    {isCreating && (
                        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" aria-modal="true" role="dialog">
                            <div className="bg-white rounded-lg p-8">
                                <GoalForm goal={null}  onGoalCreated={refetchGoals}  />
                                <Button onClick={() => setIsCreating(false)} style="mt-4 bg-gray-500 hover:bg-gray-700 text-white">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

Dashboard.propTypes = {
    goal: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        target: PropTypes.number.isRequired,
        current: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
    }),
};

export default Dashboard;