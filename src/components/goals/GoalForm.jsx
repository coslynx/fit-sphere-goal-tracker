import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import DOMPurify from 'dompurify';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { createGoal, updateGoal } from '../../services/goalService.js';

/**
 * @function GoalForm
 * @description A reusable form component for creating and editing fitness goals.
 * @param {object} [goal] - An optional object containing the goal details for editing.
 * @param {string} [goal.id] - The unique identifier of the goal.
 * @param {string} [goal.name] - The name of the goal.
 * @param {string} [goal.description] - A description of the goal.
 * @param {number} [goal.target] - The target value for the goal.
 * @param {number} [goal.current] - The current progress towards the goal.
 * @param {string} [goal.unit] - The unit of measure for the goal.
 * @returns {JSX.Element} A form for creating or editing a goal.
 *
 * @example
 * // For creating a new goal:
 * <GoalForm />
 *
 * @example
 * // For editing an existing goal:
 * const goal = {
 *   id: '123',
 *   name: 'Run a Marathon',
 *   description: 'Train to complete a 26.2 mile marathon.',
 *   target: 26.2,
 *   current: 13.1,
 *   unit: 'miles',
 * };
 * <GoalForm goal={goal} />
 */
const GoalForm = ({ goal }) => {
    const navigate = useNavigate();
    const [generalError, setGeneralError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const initialValues = goal
        ? {
            name: goal.name,
            description: goal.description,
            target: goal.target,
            unit: goal.unit,
        }
        : {
            name: '',
            description: '',
            target: 0,
            unit: '',
        };

    const validationSchema = Yup.object({
        name: Yup.string()
            .min(3, 'Name must be at least 3 characters')
            .required('Name is required'),
        description: Yup.string()
            .min(3, 'Description must be at least 3 characters')
            .required('Description is required'),
        target: Yup.number()
            .positive('Target must be greater than 0')
            .required('Target is required'),
        unit: Yup.string()
            .required('Unit is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsSubmitting(true);
        setGeneralError('');

        try {
            const sanitizedValues = {
                name: DOMPurify.sanitize(values.name),
                description: DOMPurify.sanitize(values.description),
                target: values.target,
                unit: DOMPurify.sanitize(values.unit),
            };

            let response;

            if (goal) {
                response = await updateGoal(goal.id, sanitizedValues);
            } else {
                response = await createGoal(sanitizedValues);
            }

            if (response) {
                navigate('/dashboard');
            } else {
                setGeneralError('Failed to create/update goal. Please try again.');
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
                    {goal ? 'Edit Goal' : 'Create Goal'}
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
                            <Input
                                id="name"
                                label="Name"
                                type="text"
                                placeholder="Enter goal name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.name && errors.name}
                            />
                            <Input
                                id="description"
                                label="Description"
                                type="text"
                                placeholder="Enter goal description"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.description && errors.description}
                            />
                            <Input
                                id="target"
                                label="Target"
                                type="number"
                                placeholder="Enter target value"
                                value={values.target}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.target && errors.target}
                            />
                            <Input
                                id="unit"
                                label="Unit"
                                type="text"
                                placeholder="Enter unit of measure"
                                value={values.unit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.unit && errors.unit}
                            />
                            <div className="flex items-center justify-between">
                                <Button type="submit" disabled={isSubmitting} style="w-full">
                                    {goal ? 'Update Goal' : 'Create Goal'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

GoalForm.propTypes = {
    goal: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
        target: PropTypes.number,
        current: PropTypes.number,
        unit: PropTypes.string,
    }),
};

export default GoalForm;