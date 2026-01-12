
import React, { useState } from 'react';
import { View } from '../../types';

interface BillingSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const BillingSettingsView: React.FC<BillingSettingsViewProps> = ({ setCurrentView }) => {
    const [smsAlertEnabled, setSmsAlertEnabled] = useState(false);
    const [smsAlertThreshold, setSmsAlertThreshold] = useState('50');

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

    const InfoRow: React.FC<{ label: string; value: string; isLast?: boolean }> = ({ label, value, isLast }) => (
        <div className={`flex flex-col sm:flex-row py-3 px-4 ${!isLast ? 'border-b border-gray-100' : ''} hover:bg-gray-50`}>
            <div className="w-full sm:w-1/3 font-bold text-gray-500 text-sm mb-1 sm:mb-0">
                {label}
            </div>
            <div className="w-full sm:w-2/3 text-gray-500 text-sm">
                {value}
            </div>
        </div>
    );

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
                                    item.view === 'Billing'
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
                    {/* Header Actions */}
                    <div className="flex justify-end space-x-3 mb-6">
                        <button className="bg-[#000080] hover:bg-blue-900 text-white text-sm font-bold py-2 px-4 rounded shadow-sm transition-colors">
                            Pay Subscription
                        </button>
                        <button className="bg-white border border-[#000080] text-[#000080] hover:bg-blue-50 text-sm font-bold py-2 px-4 rounded shadow-sm transition-colors">
                            Buy SMS
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Subscription Card */}
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-xl font-normal text-[#1a237e]">Subscription</h3>
                            </div>
                            <div className="bg-gray-50/30">
                                <InfoRow label="Account Plan" value="enterprise" />
                                <InfoRow label="Number of Units" value="1" />
                                <InfoRow label="Subscription cost" value="70 Kshs" />
                                <InfoRow label="Amount due" value="0.00 Kshs" />
                                <InfoRow label="Due Date" value="December 23, 2025" isLast />
                            </div>
                            <div className="p-4 bg-white border-t border-gray-200">
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Your current plan is the <span className="font-bold">enterprise plan</span> because you have <span className="font-bold">1 units</span>. If you believe this is a mistake, Please call customer support +254717512483 or email newton@bomahut.com.
                                </p>
                            </div>
                        </div>

                        {/* SMS Balance Card */}
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-xl font-normal text-[#1a237e]">SMS Balance</h3>
                            </div>
                            <div className="bg-gray-50/30 mb-6">
                                <InfoRow label="SMS Balance" value="-1.00 Kshs" />
                                <InfoRow label="Cost per SMS" value="1 Kshs" isLast />
                            </div>
                            
                            <div className="px-6 pb-6">
                                <h4 className="text-lg font-normal text-gray-700 mb-4">Alert me:</h4>
                                <div className="flex items-center mb-6">
                                    <input 
                                        type="checkbox" 
                                        id="smsAlert"
                                        className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded mr-3"
                                        checked={smsAlertEnabled}
                                        onChange={(e) => setSmsAlertEnabled(e.target.checked)}
                                    />
                                    <label htmlFor="smsAlert" className="text-sm text-gray-500 mr-4">
                                        When my available SMS balance is below:
                                    </label>
                                    <input 
                                        type="number" 
                                        value={smsAlertThreshold}
                                        onChange={(e) => setSmsAlertThreshold(e.target.value)}
                                        className="w-32 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:ring-[#1a237e] focus:border-[#1a237e]"
                                    />
                                </div>

                                <button className="bg-white border border-[#000080] text-[#000080] hover:bg-blue-50 text-sm font-medium py-2 px-6 rounded shadow-sm transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingSettingsView;
