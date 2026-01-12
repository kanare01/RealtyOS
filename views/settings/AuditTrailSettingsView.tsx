
import React, { useState } from 'react';
import { View } from '../../types';

interface AuditTrailSettingsViewProps {
    setCurrentView: (view: View) => void;
}

// Mock Data based on the image
const mockAuditLogs = [
    { id: 1, username: 'k254', fullName: '', action: 'created tenant', date: '2025-12-12, 4:44:56 PM', description: 'Created tenant mr Kabati in kanari Apartments (f1)' },
    { id: 2, username: 'k254', fullName: '', action: 'created unit', date: '2025-12-12, 4:44:08 PM', description: 'Created unit f1 in kanari Apartments' },
    { id: 3, username: 'k254', fullName: '', action: 'created property', date: '2025-12-12, 4:27:51 PM', description: 'Created property kanari Apartments' },
    { id: 4, username: 'k254', fullName: '', action: 'deleted property', date: '2025-12-12, 4:27:07 PM', description: 'Deleted property kanari Apartments' },
    { id: 5, username: 'k254', fullName: '', action: 'created property', date: '2025-12-12, 4:26:52 PM', description: 'Created property kanari Apartments' },
    { id: 6, username: 'k254', fullName: '', action: 'deleted property', date: '2025-12-12, 4:03:46 PM', description: 'Deleted property kanari Apartments' },
    { id: 7, username: 'k254', fullName: '', action: 'created property', date: '2025-12-12, 4:03:41 PM', description: 'Created property kanari Apartments' },
    { id: 8, username: 'k254', fullName: '', action: 'deleted property', date: '2025-12-12, 3:42:54 PM', description: 'Deleted property kanari Apartments' },
    { id: 9, username: 'k254', fullName: '', action: 'Archived tenant', date: '2025-12-12, 3:42:29 PM', description: 'Archived tenant mr kanare in kanari Apartments (f1)' },
    { id: 10, username: 'k254', fullName: '', action: 'created tenant', date: '2025-12-12, 3:27:59 PM', description: 'Created tenant mr kanare in kanari Apartments (f1)' },
];

const CollapsibleCard: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean; className?: string }> = ({ title, children, defaultOpen = true, className = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-sm mb-6 ${className}`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="text-lg font-medium text-[#1a237e]">{title}</h3>
                <button className="text-[#1a237e] font-bold text-xl hover:text-blue-900">
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

const AuditTrailSettingsView: React.FC<AuditTrailSettingsViewProps> = ({ setCurrentView }) => {
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
                                    item.view === 'Audit Trail'
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
                    {/* Filters Card */}
                    <CollapsibleCard title="Filters">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <div className="space-y-3">
                                    <input 
                                        type="text" 
                                        placeholder="start date" 
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-white border"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="end date" 
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-white border"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                                <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-white border text-gray-600">
                                    <option>All Users</option>
                                    <option>k254</option>
                                </select>
                            </div>
                        </div>
                    </CollapsibleCard>

                    {/* Audit Trail Table Card */}
                    <CollapsibleCard title="Audit Trail">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="text-gray-400 font-normal border-b border-gray-100">
                                    <tr>
                                        <th className="py-3 pl-4 pr-2 font-normal text-xs text-[#1a237e] w-10 text-center">[+]</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500">Username</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500">Full Name</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500">Action Taken</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500">Date and Time</th>
                                        <th className="py-3 font-normal text-xs text-gray-500">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    {mockAuditLogs.map((log) => (
                                        <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4 pl-4 pr-2 text-[#1a237e] font-bold cursor-pointer text-center">+</td>
                                            <td className="py-4 pr-4 text-gray-500">{log.username}</td>
                                            <td className="py-4 pr-4 text-gray-500">{log.fullName}</td>
                                            <td className="py-4 pr-4 text-gray-500">{log.action}</td>
                                            <td className="py-4 pr-4 text-gray-500">{log.date}</td>
                                            <td className="py-4 text-gray-500">{log.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="mt-6 flex justify-between items-center text-xs text-gray-500">
                            <div>Showing 1 to 10 of 12 Results</div>
                            <div className="flex items-center space-x-1">
                                <button className="px-3 py-1 bg-gray-200 rounded text-gray-700 font-medium">1</button>
                                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 bg-white">2</button>
                                <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 bg-white">›</button>
                            </div>
                        </div>
                    </CollapsibleCard>
                </div>
            </div>
        </div>
    );
};

export default AuditTrailSettingsView;
