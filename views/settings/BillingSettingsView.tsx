
import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface BillingSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const BillingSettingsView: React.FC<BillingSettingsViewProps> = ({ setCurrentView }) => {
    const { units } = useData();
    
    // Dynamic Data State
    const [smsBalance, setSmsBalance] = useState(-1.00);
    const [subscriptionDue, setSubscriptionDue] = useState<number>(0);
    const [dueDate, setDueDate] = useState('December 23, 2025');
    
    // Form State
    const [smsAlertEnabled, setSmsAlertEnabled] = useState(false);
    const [smsAlertThreshold, setSmsAlertThreshold] = useState('50');

    // UI State
    const [loadingAction, setLoadingAction] = useState<'pay' | 'buy_sms' | 'save' | null>(null);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    // Calculate plan details based on units
    const unitCount = units.length;
    const costPerUnit = 70; // KES
    const calculatedCost = Math.max(unitCount * costPerUnit, 0); // Ensure non-negative
    const planName = unitCount > 10 ? 'Enterprise' : 'Starter';

    // Initialize due amount on load
    useEffect(() => {
        setSubscriptionDue(calculatedCost);
    }, [calculatedCost]);

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

    const showNotificationMsg = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handlePaySubscription = () => {
        if (subscriptionDue <= 0) {
            showNotificationMsg('No amount currently due.', 'success');
            return;
        }

        setLoadingAction('pay');
        setTimeout(() => {
            setSubscriptionDue(0);
            // Advance date by 1 month
            const current = new Date(dueDate);
            current.setMonth(current.getMonth() + 1);
            setDueDate(current.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
            
            setLoadingAction(null);
            showNotificationMsg('Subscription paid successfully.');
        }, 1500);
    };

    const handleBuySMS = () => {
        setLoadingAction('buy_sms');
        setTimeout(() => {
            setSmsBalance(prev => prev + 500); // Add 500 KES worth of SMS
            setLoadingAction(null);
            showNotificationMsg('Purchased 500 SMS credits.');
        }, 1500);
    };

    const handleSaveSettings = () => {
        setLoadingAction('save');
        setTimeout(() => {
            setLoadingAction(null);
            showNotificationMsg('Alert preferences saved.');
        }, 1000);
    };

    const InfoRow: React.FC<{ label: string; value: string | number; isLast?: boolean; highlight?: boolean }> = ({ label, value, isLast, highlight }) => (
        <div className={`flex flex-col sm:flex-row py-3 px-4 ${!isLast ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
            <div className="w-full sm:w-1/3 font-bold text-gray-500 text-sm mb-1 sm:mb-0">
                {label}
            </div>
            <div className={`w-full sm:w-2/3 text-sm ${highlight ? 'font-bold text-[#1a237e]' : 'text-gray-600'}`}>
                {value}
            </div>
        </div>
    );

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
            
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 right-4 md:right-10 z-50 animate-fadeIn">
                    <div className={`${notification.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded relative shadow-lg`} role="alert">
                        <strong className="font-bold">{notification.type === 'success' ? 'Success!' : 'Error!'}</strong>
                        <span className="block sm:inline"> {notification.message}</span>
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
                        <button 
                            onClick={handlePaySubscription}
                            disabled={loadingAction === 'pay' || subscriptionDue <= 0}
                            className={`text-white text-sm font-bold py-2 px-4 rounded shadow-sm transition-colors flex items-center ${
                                subscriptionDue <= 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-[#000080] hover:bg-blue-900'
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {loadingAction === 'pay' ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing...
                                </span>
                            ) : subscriptionDue <= 0 ? (
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    Paid
                                </span>
                            ) : 'Pay Subscription'}
                        </button>
                        
                        <button 
                            onClick={handleBuySMS}
                            disabled={loadingAction === 'buy_sms'}
                            className="bg-white border border-[#000080] text-[#000080] hover:bg-blue-50 text-sm font-bold py-2 px-4 rounded shadow-sm transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loadingAction === 'buy_sms' ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#000080]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing...
                                </span>
                            ) : 'Buy SMS'}
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Subscription Card */}
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                                <h3 className="text-xl font-normal text-[#1a237e]">Subscription</h3>
                            </div>
                            <div className="bg-white">
                                <InfoRow label="Account Plan" value={planName} />
                                <InfoRow label="Number of Units" value={unitCount} />
                                <InfoRow label="Subscription cost" value={`${calculatedCost.toLocaleString()} Kshs`} />
                                <InfoRow label="Amount due" value={`${subscriptionDue.toLocaleString()} Kshs`} highlight={subscriptionDue > 0} />
                                <InfoRow label="Due Date" value={dueDate} isLast />
                            </div>
                            <div className="p-4 bg-blue-50/50 border-t border-gray-200">
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Your current plan is the <span className="font-bold text-[#1a237e]">{planName} plan</span> because you have <span className="font-bold text-[#1a237e]">{unitCount} units</span>. If you believe this is a mistake, please call customer support at +254717512483 or email newton@bomahut.com.
                                </p>
                            </div>
                        </div>

                        {/* SMS Balance Card */}
                        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                                <h3 className="text-xl font-normal text-[#1a237e]">SMS Balance</h3>
                            </div>
                            <div className="bg-white mb-6">
                                <InfoRow 
                                    label="SMS Balance" 
                                    value={`${smsBalance.toFixed(2)} Kshs`} 
                                    highlight 
                                />
                                <InfoRow label="Cost per SMS" value="1 Kshs" isLast />
                            </div>
                            
                            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                                <h4 className="text-lg font-normal text-gray-700 mb-4">Alert me:</h4>
                                <div className="flex flex-wrap items-center mb-6 gap-4">
                                    <div className="flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="smsAlert"
                                            className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded mr-3 cursor-pointer"
                                            checked={smsAlertEnabled}
                                            onChange={(e) => setSmsAlertEnabled(e.target.checked)}
                                        />
                                        <label htmlFor="smsAlert" className="text-sm text-gray-600 mr-2 cursor-pointer">
                                            When my available SMS balance is below:
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            type="number" 
                                            value={smsAlertThreshold}
                                            onChange={(e) => setSmsAlertThreshold(e.target.value)}
                                            disabled={!smsAlertEnabled}
                                            className="w-24 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 focus:ring-[#1a237e] focus:border-[#1a237e] disabled:bg-gray-100 disabled:text-gray-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-500">Kshs</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleSaveSettings}
                                    disabled={loadingAction === 'save'}
                                    className="bg-white border border-[#000080] text-[#000080] hover:bg-blue-50 text-sm font-medium py-2 px-6 rounded shadow-sm transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loadingAction === 'save' ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#000080]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Saving...
                                        </span>
                                    ) : 'Save Changes'}
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
