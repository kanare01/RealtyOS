
import React, { useState } from 'react';
import { View } from '../../types';

interface AlertsSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const AlertsSettingsView: React.FC<AlertsSettingsViewProps> = ({ setCurrentView }) => {
    // State
    const [paymentAlerts, setPaymentAlerts] = useState(false);
    const [receiveReports, setReceiveReports] = useState(true);
    const [reportFrequency, setReportFrequency] = useState({
        monthly: true,
        weekly: false,
        daily: false
    });
    
    // UI State
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

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
        if (!receiveReports) return;
        setReportFrequency(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const showNotification = (message: string, type: 'success' | 'info') => {
        setNotification({ message, type });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSaveSettings = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            showNotification('Alert preferences updated successfully.', 'success');
        }, 800);
    };

    const handleRestoreDefaults = () => {
        if(confirm("Are you sure you want to restore default alert settings?")) {
            setPaymentAlerts(false);
            setReceiveReports(true);
            setReportFrequency({ monthly: true, weekly: false, daily: false });
            showNotification('Default settings restored.', 'info');
        }
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 right-4 md:right-10 z-50 animate-fadeIn">
                    <div className={`${notification.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-blue-100 border-blue-400 text-blue-700'} border px-4 py-3 rounded relative shadow-lg`} role="alert">
                        <strong className="font-bold">{notification.type === 'success' ? 'Success!' : 'Info:'}</strong>
                        <span className="block sm:inline"> {notification.message}</span>
                        <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setNotification(null)}>
                            <svg className={`fill-current h-6 w-6 ${notification.type === 'success' ? 'text-green-500' : 'text-blue-500'}`} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </button>
                    </div>
                </div>
            )}

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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-medium text-gray-700">Alerts & Notifications</h2>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[300px]">
                        
                        <div className="p-8 space-y-8">
                            {/* Payment Alerts */}
                            <div className="flex items-center justify-between sm:justify-start">
                                <label htmlFor="paymentAlerts" className="text-sm font-medium text-gray-700 w-48">
                                    Receive Payment Alerts
                                </label>
                                <div className="flex items-center">
                                    <input 
                                        id="paymentAlerts"
                                        type="checkbox" 
                                        checked={paymentAlerts}
                                        onChange={(e) => setPaymentAlerts(e.target.checked)}
                                        className="h-5 w-5 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded cursor-pointer" 
                                    />
                                    <span className="ml-2 text-sm text-gray-500">Notify me when a payment is recorded</span>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Reports */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between sm:justify-start">
                                    <label htmlFor="receiveReports" className="text-sm font-medium text-gray-700 w-48">
                                        Receive Reports
                                    </label>
                                    <div className="flex items-center">
                                        <input 
                                            id="receiveReports"
                                            type="checkbox" 
                                            checked={receiveReports}
                                            onChange={(e) => setReceiveReports(e.target.checked)}
                                            className="h-5 w-5 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded cursor-pointer" 
                                        />
                                        <span className="ml-2 text-sm text-gray-500">Enable automated email reports</span>
                                    </div>
                                </div>
                                
                                <div className={`ml-0 sm:ml-48 pl-0 sm:pl-0 transition-opacity duration-300 ${receiveReports ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                    <p className="text-sm text-gray-600 mb-3 font-medium">Frequency:</p>
                                    <div className="flex flex-wrap gap-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={reportFrequency.monthly}
                                                onChange={() => toggleFrequency('monthly')}
                                                disabled={!receiveReports}
                                                className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Monthly</span>
                                        </label>

                                        <label className="flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={reportFrequency.weekly}
                                                onChange={() => toggleFrequency('weekly')}
                                                disabled={!receiveReports}
                                                className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Weekly</span>
                                        </label>

                                        <label className="flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={reportFrequency.daily}
                                                onChange={() => toggleFrequency('daily')}
                                                disabled={!receiveReports}
                                                className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Daily</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-gray-100" />
                        </div>

                        {/* Actions */}
                        <div className="px-8 pb-8 bg-gray-50/50 flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-100 pt-6">
                            <button 
                                onClick={handleSaveSettings}
                                disabled={isSaving}
                                className={`bg-[#1a237e] hover:bg-blue-900 text-white font-medium py-2 px-6 rounded shadow-sm text-sm transition-colors flex items-center justify-center min-w-[140px] ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : 'Save Settings'}
                            </button>
                            <button 
                                onClick={handleRestoreDefaults}
                                className="bg-white border border-[#1a237e] text-[#1a237e] hover:bg-blue-50 font-medium py-2 px-6 rounded shadow-sm text-sm transition-colors"
                            >
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
