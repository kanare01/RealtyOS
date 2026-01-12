import React from 'react';
import DashboardCard from './DashboardCard';

interface StatCardProps {
    title: string;
    value: string;
    subtext: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext }) => {
    return (
        <DashboardCard title={title}>
            <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{subtext}</p>
            </div>
            <div className="mt-4 flex justify-center space-x-2">
                <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors">
                    View Details
                </button>
                <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors">
                    Send Reminders
                </button>
            </div>
             <div className="text-center mt-4">
                <a href="#" className="text-sm text-blue-600 hover:underline">View Insights &rarr;</a>
            </div>
        </DashboardCard>
    );
};

export default StatCard;