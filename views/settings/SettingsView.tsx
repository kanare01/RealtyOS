
import React from 'react';
import { View } from '../../types';

interface SettingsViewProps {
    setCurrentView: (view: View) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ setCurrentView }) => {
    const settingsModules = [
        { title: 'General', description: 'Company details, currency, timezone, and communication preferences.', view: 'General', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
        { title: 'Account Info', description: 'Manage your profile, password, and agent codes.', view: 'Account Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { title: 'Billing', description: 'Subscription plans, payment history, and SMS balance.', view: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { title: 'Team', description: 'Add and manage team members and their roles.', view: 'Team', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { title: 'Alerts', description: 'Configure email and SMS notification preferences.', view: 'Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
        { title: 'Custom Message Template', description: 'Edit templates for automated SMS and emails.', view: 'Custom Message Template', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
        { title: 'MPESA Transactions', description: 'View and search real-time MPESA payment logs.', view: 'MPESA Transactions', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { title: 'Documents (beta)', description: 'Manage legal document templates and generation.', view: 'Documents (beta)', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { title: 'Backup', description: 'Download full system backups.', view: 'Backup', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
        { title: 'Audit Trail', description: 'View system activity logs and user actions.', view: 'Audit Trail', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    ];

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Settings</h2>
                <p className="text-gray-500">Manage your organization configurations and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingsModules.map((mod) => (
                    <button
                        key={mod.title}
                        onClick={() => setCurrentView(mod.view as View)}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left flex flex-col h-full group"
                    >
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#1a237e] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a237e] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mod.icon} />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-[#1a237e]">{mod.title}</h3>
                        <p className="text-sm text-gray-500">{mod.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SettingsView;
