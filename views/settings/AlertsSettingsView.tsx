
import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';
import { API_BASE_URL } from '../../config';

interface AlertsSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const AlertsSettingsView: React.FC<AlertsSettingsViewProps> = ({ setCurrentView }) => {
    const { addNotification } = useData();
    const [paymentAlerts, setPaymentAlerts] = useState(false);
    const [receiveReports, setReceiveReports] = useState(true);
    const [reportFrequency, setReportFrequency] = useState({
        monthly: true,
        weekly: false,
        daily: false
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Fetch current settings
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/settings`, {
                    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.alert_payment) setPaymentAlerts(data.alert_payment === 'true');
                    if (data.alert_reports) setReceiveReports(data.alert_reports === 'true');
                    
                    setReportFrequency({
                        monthly: data.report_freq_monthly === 'true',
                        weekly: data.report_freq_weekly === 'true',
                        daily: data.report_freq_daily === 'true'
                    });
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchSettings();
    }, []);

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

    const handleSaveSettings = async () => {
        setIsSaving(true);
        const payload = {
            alert_payment: paymentAlerts.toString(),
            alert_reports: receiveReports.toString(),
            report_freq_monthly: reportFrequency.monthly.toString(),
            report_freq_weekly: reportFrequency.weekly.toString(),
            report_freq_daily: reportFrequency.daily.toString()
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/settings`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '' 
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                addNotification('Alert preferences updated successfully.', 'success');
            } else {
                addNotification('Failed to update settings.', 'error');
            }
        } catch (e) {
            addNotification('Network error.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRestoreDefaults = () => {
        if(confirm("Are you sure you want to restore default alert settings?")) {
            setPaymentAlerts(false);
            setReceiveReports(true);
            setReportFrequency({ monthly: true, weekly: false, daily: false });
            addNotification('Default settings restored. Click Save to persist.', 'info');
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
                                {isSaving ? 'Saving...' : 'Save Settings'}
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
