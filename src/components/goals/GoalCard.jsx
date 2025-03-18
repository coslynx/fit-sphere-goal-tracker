import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

/**
 * @function GoalCard
 * @description Displays the details of a single fitness goal.
 * @param {object} goal - An object containing the goal details. (Required)
 * @param {string} goal.id - The unique identifier of the goal. (Required)
 * @param {string} goal.name - The name of the goal. (Required)
 * @param {string} goal.description - A description of the goal. (Required)
 * @param {number} goal.target - The target value for the goal. (Required)
 * @param {number} goal.current - The current progress towards the goal. (Required)
 * @param {string} goal.unit - The unit of measure for the goal. (Required)
 * @returns {JSX.Element} A card displaying the goal details and progress.
 *
 * @example
 * const goal = {
 *   id: '123',
 *   name: 'Run a Marathon',
 *   description: 'Train to complete a 26.2 mile marathon.',
 *   target: 26.2,
 *   current: 13.1,
 *   unit: 'miles',
 * };
 * <GoalCard goal={goal} />
 */
const GoalCard = ({ goal }) => {
    const { id, name, description, target, current, unit } = goal;

    // Sanitize name and description to prevent XSS attacks
    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedDescription = DOMPurify.sanitize(description);

    // Calculate progress percentage, capping at 100%
    const percentage = Math.min((current / target) * 100, 100);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {sanitizedName}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {sanitizedDescription}
                </p>
                <div className="mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                            Progress: {current} / {target} {unit}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                            {percentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            role="progressbar"
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: `${percentage}%` }}
                            className="h-full bg-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

GoalCard.propTypes = {
    goal: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        target: PropTypes.number.isRequired,
        current: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
    }).isRequired,
};

export default GoalCard;