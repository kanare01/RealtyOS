
import React, { useEffect } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface FeedbackSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const FeedbackSettingsView: React.FC<FeedbackSettingsViewProps> = ({ setCurrentView }) => {
    const { feedbacks, refreshFeedbacks } = useData();

    const settingsMenu: { label: string; view: View }[] = [
        { label: 'General', view: 'General' },
        { label: 'Backup', view: 'Backup' },
        { label: 'Alerts', view: 'Alerts' },
        { label: 'Account Info', view: 'Account Info' },
        { label: 'Documents (beta)', view: 'Documents (beta)' },
        { label: 'Custom Message Template', view: 'Custom Message Template' },
        { label: 'Team', view: 'Team' },
        { label: 'Billing', view: 'Billing' },
        { label: 'MPESA Transactions Status', view: 'MPESA Transactions' },
        { label: 'Audit Trail', view: 'Audit Trail' },
        { label: 'User Feedback', view: 'User Feedback' },
    ];

    useEffect(() => {
        refreshFeedbacks();
    }, []);

    const getTypeColor = (type: string) => {
        switch(type) {
            case 'Bug Report': return 'bg-red-100 text-red-800';
            case 'Feature Request': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {settingsMenu.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => setCurrentView(item.view)}
                                className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                    item.view === 'User Feedback'
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-medium text-gray-700">User Feedback</h2>
                        <button 
                            onClick={refreshFeedbacks}
                            className="text-sm text-[#1a237e] hover:underline"
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="space-y-4">
                        {feedbacks.length === 0 ? (
                            <div className="text-center py-10 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <p className="text-gray-500">No feedback submitted yet.</p>
                            </div>
                        ) : (
                            feedbacks.map((item) => (
                                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${getTypeColor(item.type)}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-sm text-gray-500">{item.createdAt}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">by {item.username}</span>
                                    </div>
                                    <p className="text-gray-800 mt-2">{item.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackSettingsView;
