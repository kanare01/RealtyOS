
import React from 'react';
import DashboardCard from '../../components/shared/DashboardCard';

interface StatCardProps {
    title: string;
    value: string;
    subtext: string;
    onViewDetails?: () => void;
    onSendReminders?: () => void;
    onViewInsights?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    subtext, 
    onViewDetails, 
    onSendReminders, 
    onViewInsights 
}) => {
    return (
        <DashboardCard title={title}>
            <div className="text-center">
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{subtext}</p>
            </div>
            <div className="mt-4 flex justify-center space-x-2">
                <button 
                    onClick={onViewDetails}
                    className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                >
                    View Details
                </button>
                <button 
                    onClick={onSendReminders}
                    className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                >
                    Send Reminders
                </button>
            </div>
             <div className="text-center mt-4">
                <button 
                    onClick={onViewInsights}
                    className="text-sm text-blue-600 hover:underline"
                >
                    View Insights &rarr;
                </button>
            </div>
        </DashboardCard>
    );
};

export default StatCard;
