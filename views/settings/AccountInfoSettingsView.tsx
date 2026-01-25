
import React from 'react';
import { View } from '../../types';

interface AccountInfoSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const AccountInfoSettingsView: React.FC<AccountInfoSettingsViewProps> = ({ setCurrentView }) => {
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
                                    item.view === 'Account Info'
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
                <div className="flex-1 space-y-6">
                    
                    {/* Account Details */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-gray-800 mb-6">Account Details</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 text-sm">
                                <div className="text-gray-700">Username: <span className="font-normal text-gray-600">k254</span></div>
                                <div className="text-gray-700">First Name: <span className="font-normal text-gray-600"></span></div>
                                <div className="text-gray-700">Last Name: <span className="font-normal text-gray-600"></span></div>
                                <div className="text-gray-700">Email: <span className="font-normal text-gray-600">kwash904@gmail.com</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Signature Pad */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-1">Signature pad</h2>
                            <p className="text-gray-500 text-sm">Update your signature</p>
                        </div>
                        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200">
                            <button className="bg-[#000080] hover:bg-blue-900 text-white font-medium py-2 px-4 rounded shadow-sm text-sm transition-colors">
                                Update Signature
                            </button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-1">Password</h2>
                            <p className="text-gray-500 text-sm">A secure password helps protect your Bomahut Account.</p>
                        </div>
                        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200">
                            <button className="bg-[#000080] hover:bg-blue-900 text-white font-medium py-2 px-4 rounded shadow-sm text-sm transition-colors">
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Agent Code */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-1">Agent Code</h2>
                            <p className="text-gray-500 text-sm">Generate agent code used in the copilot app.</p>
                        </div>
                        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200">
                            <button className="bg-[#000080] hover:bg-blue-900 text-white font-medium py-2 px-4 rounded shadow-sm text-sm transition-colors">
                                Generate Agent Code
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AccountInfoSettingsView;
