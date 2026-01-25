
import React, { useState } from 'react';
import { View } from '../../types';

interface AlertsSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const AlertsSettingsView: React.FC<AlertsSettingsViewProps> = ({ setCurrentView }) => {
    const [paymentAlerts, setPaymentAlerts] = useState(false);
    const [receiveReports, setReceiveReports] = useState(true);
    const [reportFrequency, setReportFrequency] = useState({
        monthly: false,
        weekly: false,
        daily: false
    });

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

    const toggleFrequency = (key: keyof typeof reportFrequency) => {
        setReportFrequency(prev => ({ ...prev, [key]: !prev[key] }));
    };

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
                                    item.view === 'Alerts'
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
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[300px]">
                        
                        <div className="p-8 space-y-8">
                            {/* Payment Alerts */}
                            <div className="flex items-center">
                                <label htmlFor="paymentAlerts" className="text-sm text-gray-500 w-48">
                                    Receive Payment Alerts
                                </label>
                                <input 
                                    id="paymentAlerts"
                                    type="checkbox" 
                                    checked={paymentAlerts}
                                    onChange={(e) => setPaymentAlerts(e.target.checked)}
                                    className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                />
                            </div>

                            <hr className="border-gray-100" />

                            {/* Reports */}
                            <div className="flex flex-col sm:flex-row sm:items-center">
                                <div className="flex items-center w-48 mb-4 sm:mb-0">
                                    <label htmlFor="receiveReports" className="text-sm text-gray-500 mr-4 sm:mr-0 w-full">
                                        Receive Reports
                                    </label>
                                    <input 
                                        id="receiveReports"
                                        type="checkbox" 
                                        checked={receiveReports}
                                        onChange={(e) => setReceiveReports(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded sm:hidden" 
                                    />
                                </div>
                                
                                <div className="flex items-center flex-wrap gap-x-8 gap-y-2">
                                    <input 
                                        type="checkbox" 
                                        checked={receiveReports}
                                        onChange={(e) => setReceiveReports(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded hidden sm:block" 
                                    />

                                    <div className="flex items-center">
                                        <label htmlFor="monthly" className="text-sm text-gray-500 mr-3">Monthly</label>
                                        <input 
                                            id="monthly"
                                            type="checkbox" 
                                            checked={reportFrequency.monthly}
                                            onChange={() => toggleFrequency('monthly')}
                                            disabled={!receiveReports}
                                            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" 
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <label htmlFor="weekly" className="text-sm text-gray-500 mr-3">Weekly</label>
                                        <input 
                                            id="weekly"
                                            type="checkbox" 
                                            checked={reportFrequency.weekly}
                                            onChange={() => toggleFrequency('weekly')}
                                            disabled={!receiveReports}
                                            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" 
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <label htmlFor="daily" className="text-sm text-gray-500 mr-3">Daily</label>
                                        <input 
                                            id="daily"
                                            type="checkbox" 
                                            checked={reportFrequency.daily}
                                            onChange={() => toggleFrequency('daily')}
                                            disabled={!receiveReports}
                                            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded" 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-gray-100" />
                        </div>

                        {/* Actions */}
                        <div className="px-8 pb-8 bg-gray-50/50 flex justify-center gap-4">
                            <button className="bg-[#5c54a0] hover:bg-[#4a438a] text-white font-medium py-2 px-6 rounded shadow-sm text-sm transition-colors">
                                Save Settings
                            </button>
                            <button className="bg-[#000080] hover:bg-[#000060] text-white font-medium py-2 px-6 rounded shadow-sm text-sm transition-colors">
                                Restore Default Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertsSettingsView;
