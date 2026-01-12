
import React, { useState } from 'react';
import { View } from '../../types';

interface TeamSettingsViewProps {
    setCurrentView: (view: View) => void;
}

interface TeamMember {
    id: number;
    phone: string;
    username: string;
    email: string;
}

const mockTeamMembers: TeamMember[] = [
    {
        id: 1,
        phone: '+254-704623980',
        username: 'k254',
        email: 'kwash904@gmail.com',
    }
];

const CollapsibleCard: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-medium text-[#1a237e]">{title}</h3>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-800 hover:text-gray-600 font-bold text-xl"
                >
                    {isOpen ? '−' : '+'}
                </button>
            </div>
            {isOpen && (
                <div className="p-6">
                    {children}
                </div>
            )}
        </div>
    );
};

const TeamSettingsView: React.FC<TeamSettingsViewProps> = ({ setCurrentView }) => {
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
    ];

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {settingsMenu.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => setCurrentView(item.view)}
                                className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                    item.view === 'Team'
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
                <div className="flex-1 relative">
                    {/* Add Team Member Button - positioned absolutely to match image layout relative to content */}
                    <div className="flex justify-end mb-4">
                        <button className="bg-[#000080] hover:bg-blue-900 text-white text-sm font-medium py-2 px-4 rounded shadow-sm transition-colors">
                            Add Team Member
                        </button>
                    </div>

                    {/* Summary Card */}
                    <CollapsibleCard title="Summary">
                        <div className="flex justify-center items-center">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <span className="h-[1px] w-12 bg-gray-200 mr-3"></span>
                                    <span className="text-gray-500 text-sm">Total Team</span>
                                    <span className="h-[1px] w-12 bg-gray-200 ml-3"></span>
                                </div>
                                <div className="text-[#1a237e] text-3xl font-medium">1</div>
                            </div>
                        </div>
                    </CollapsibleCard>

                    {/* Team Members Card */}
                    <CollapsibleCard title="Team Members">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="text-gray-400 font-normal border-b border-gray-100">
                                    <tr>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500">Name</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500">Phone Number</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500">username</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500">Email</th>
                                        <th className="py-3 font-normal text-xs text-gray-500">Options</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    {mockTeamMembers.map((member) => (
                                        <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4 pr-4">
                                                <a href="#" className="text-blue-600 hover:underline">Edit</a>
                                            </td>
                                            <td className="py-4 pr-4 text-gray-500">{member.phone}</td>
                                            <td className="py-4 pr-4 text-gray-500">{member.username}</td>
                                            <td className="py-4 pr-4 text-gray-500">{member.email}</td>
                                            <td className="py-4">
                                                <div className="relative inline-block text-left">
                                                    <button className="inline-flex justify-between w-full px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none">
                                                        Options
                                                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="mt-4 flex items-center space-x-1">
                            <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>‹</button>
                            <button className="px-3 py-1 bg-gray-200 rounded text-xs text-gray-700 font-medium">1</button>
                            <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>›</button>
                        </div>
                    </CollapsibleCard>
                </div>
            </div>
        </div>
    );
};

export default TeamSettingsView;
