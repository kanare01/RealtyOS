
import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface MpesaTransactionsSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const MpesaTransactionsSettingsView: React.FC<MpesaTransactionsSettingsViewProps> = ({ setCurrentView }) => {
    const { mpesaTransactions, refreshMpesaTransactions } = useData();
    const [shortcode, setShortcode] = useState('');
    const [reference, setReference] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
    const [filteredTransactions, setFilteredTransactions] = useState(mpesaTransactions);

    // Sync initial data
    useEffect(() => {
        setFilteredTransactions(mpesaTransactions);
    }, [mpesaTransactions]);

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

    const showNotificationMsg = (message: string, type: 'success' | 'info' = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSearch = () => {
        setIsLoading(true);
        setTimeout(() => {
            let filtered = mpesaTransactions;

            if (shortcode) {
                filtered = filtered.filter(t => t.shortcode.includes(shortcode));
            }
            if (reference) {
                filtered = filtered.filter(t => t.reference.toLowerCase().includes(reference.toLowerCase()));
            }

            setFilteredTransactions(filtered);
            setIsLoading(false);
            showNotificationMsg(`Found ${filtered.length} transaction(s).`, 'success');
        }, 500);
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        await refreshMpesaTransactions();
        setShortcode('');
        setReference('');
        setIsLoading(false);
        showNotificationMsg('Transactions refreshed from API.', 'success');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Completed': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Completed</span>;
            case 'Failed': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Failed</span>;
            case 'Pending': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">Pending</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 right-4 md:right-10 z-50 animate-fadeIn">
                    <div className="bg-blue-50 border-blue-400 text-blue-700 border px-4 py-3 rounded relative shadow-lg" role="alert">
                        <strong className="font-bold">Info:</strong>
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
                                    item.view === 'MPESA Transactions'
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
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-700">MPESA Transactions Status</h2>
                        </div>
                        
                        <div className="p-6">
                            {/* Search Form */}
                            <div className="border border-gray-200 rounded p-4 mb-6 bg-gray-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            Enter Shortcode
                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-white text-[10px] font-bold cursor-help" title="Paybill or Till Number">i</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            value={shortcode}
                                            onChange={(e) => setShortcode(e.target.value)}
                                            placeholder="e.g. 247247"
                                            className="w-full border-gray-300 rounded-sm shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            MPESA Transaction Reference
                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-white text-[10px] font-bold cursor-help" title="Unique ID">i</span>
                                        </label>
                                        <div className="flex">
                                            <input 
                                                type="text" 
                                                value={reference}
                                                onChange={(e) => setReference(e.target.value)}
                                                placeholder="e.g. QKA..."
                                                className="flex-1 border-gray-300 rounded-l-sm shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border border-r-0"
                                            />
                                            <button 
                                                onClick={handleSearch}
                                                disabled={isLoading}
                                                className="bg-[#000080] hover:bg-blue-900 text-white text-sm font-medium px-6 rounded-r-sm transition-colors disabled:opacity-70"
                                            >
                                                {isLoading ? '...' : 'Search'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Refresh Button */}
                            <div className="flex justify-center mb-6">
                                <button 
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                    className="flex items-center text-[#1a237e] bg-white border border-[#1a237e] hover:bg-blue-50 font-medium py-1.5 px-4 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {isLoading ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>

                            <p className="text-sm text-gray-500 mb-4">Displaying results from the last 30 days.</p>

                            {/* Table */}
                            <div className="overflow-x-auto border border-gray-200 rounded-sm">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 font-medium">
                                        <tr>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal">Reference</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal">Status</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal">Description</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal">Shortcode</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal">Created Date</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal text-right">Amount (KES)</th>
                                            <th className="p-3 font-normal">Tenant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        {filteredTransactions.length > 0 ? (
                                            filteredTransactions.map((tx) => (
                                                <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="p-3 border-r border-gray-200 text-[#1a237e] font-mono text-xs">{tx.reference}</td>
                                                    <td className="p-3 border-r border-gray-200">{getStatusBadge(tx.status)}</td>
                                                    <td className="p-3 border-r border-gray-200">{tx.description}</td>
                                                    <td className="p-3 border-r border-gray-200 text-xs font-mono">{tx.shortcode}</td>
                                                    <td className="p-3 border-r border-gray-200 text-xs">{tx.date}</td>
                                                    <td className="p-3 border-r border-gray-200 text-right font-medium">{tx.amount.toLocaleString()}</td>
                                                    <td className="p-3 font-medium">{tx.tenant || '-'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                                    No transactions found. Try adjusting your search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="mt-4 text-sm text-gray-500">
                                Showing {filteredTransactions.length} result(s)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MpesaTransactionsSettingsView;
