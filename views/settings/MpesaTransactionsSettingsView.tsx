
import React, { useState } from 'react';
import { View } from '../../types';

interface MpesaTransactionsSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const MpesaTransactionsSettingsView: React.FC<MpesaTransactionsSettingsViewProps> = ({ setCurrentView }) => {
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
                            <div className="border border-gray-200 rounded p-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            Enter Shortcode
                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white text-[10px] font-bold" title="Info">i</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="Select shortcode"
                                            className="w-full border-gray-300 rounded-sm shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            MPESA Transaction Reference
                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-800 text-white text-[10px] font-bold" title="Info">i</span>
                                        </label>
                                        <div className="flex">
                                            <input 
                                                type="text" 
                                                placeholder="Enter transaction reference"
                                                className="flex-1 border-gray-300 rounded-l-sm shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border border-r-0"
                                            />
                                            <button className="bg-[#000080] hover:bg-blue-900 text-white text-sm font-medium px-6 rounded-r-sm transition-colors">
                                                Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Refresh Button */}
                            <div className="flex justify-center mb-6">
                                <button className="flex items-center text-[#1a237e] bg-white border border-[#1a237e] hover:bg-blue-50 font-medium py-1.5 px-4 rounded text-sm transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh
                                </button>
                            </div>

                            <p className="text-sm text-blue-300 mb-4">This table shows the transactions you have queried</p>

                            {/* Table */}
                            <div className="overflow-x-auto border border-gray-200 rounded-sm">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-white text-blue-300/80 border-b border-gray-200 font-medium">
                                        <tr>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal bg-gray-50/50">Reference</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal bg-gray-50/50">Status</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal bg-gray-50/50">Description</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal bg-gray-50/50">Paybill/Till Number</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal bg-gray-50/50">Created Date</th>
                                            <th className="p-3 border-r border-gray-200 last:border-r-0 font-normal bg-gray-50/50">Payment</th>
                                            <th className="p-3 font-normal bg-gray-50/50">Tenant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        {/* Empty State Rows to maintain structure if needed, or just allow it to be empty */}
                                        <tr>
                                            <td className="p-3 border-r border-gray-200 border-b border-gray-100">&nbsp;</td>
                                            <td className="p-3 border-r border-gray-200 border-b border-gray-100">&nbsp;</td>
                                            <td className="p-3 border-r border-gray-200 border-b border-gray-100">&nbsp;</td>
                                            <td className="p-3 border-r border-gray-200 border-b border-gray-100">&nbsp;</td>
                                            <td className="p-3 border-r border-gray-200 border-b border-gray-100">&nbsp;</td>
                                            <td className="p-3 border-r border-gray-200 border-b border-gray-100">&nbsp;</td>
                                            <td className="p-3 border-b border-gray-100">&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="mt-4 text-sm text-blue-300/80">
                                Showing 0 to 0 of 0 Results
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MpesaTransactionsSettingsView;
