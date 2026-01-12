
import React, { useState } from 'react';
import { View } from '../../types';

interface DocumentsSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const DocumentsSettingsView: React.FC<DocumentsSettingsViewProps> = ({ setCurrentView }) => {
    const [activeTab, setActiveTab] = useState<'DOCUMENTS' | 'TEMPLATES'>('DOCUMENTS');

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
                                    item.view === 'Documents (beta)'
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
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-medium text-gray-700">Documents (beta)</h2>
                        <button className="bg-[#000080] hover:bg-blue-900 text-white text-sm font-medium py-2 px-4 rounded shadow-sm transition-colors">
                            Add New Document
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[400px]">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 px-6">
                            <button
                                onClick={() => setActiveTab('DOCUMENTS')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'DOCUMENTS'
                                        ? 'border-[#1a237e] text-[#1a237e]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                DOCUMENTS
                            </button>
                            <button
                                onClick={() => setActiveTab('TEMPLATES')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'TEMPLATES'
                                        ? 'border-[#1a237e] text-[#1a237e]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                TEMPLATES
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'DOCUMENTS' ? (
                                <div>
                                    <p className="text-sm text-gray-800 mb-6">
                                        Use this page to customize documents to be sent to tenants
                                    </p>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm text-left">
                                            <thead className="text-gray-400 font-medium border-b border-gray-100">
                                                <tr>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Member Name <span className="text-[10px]">▲</span></th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Property - Unit <span className="text-[10px]">♦</span></th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Document Type <span className="text-[10px]">♦</span></th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Status <span className="text-[10px]">♦</span></th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Date Created <span className="text-[10px]">♦</span></th>
                                                    <th className="py-3 font-normal text-xs uppercase tracking-wide">Options</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                {/* Empty State */}
                                            </tbody>
                                        </table>
                                        <div className="pt-4 text-xs text-gray-400">
                                            Showing rows 0 to 0 of 0
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-800 mb-6">
                                        Use this page to customize templates used to create tenant documents
                                    </p>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm text-left">
                                            <thead className="text-gray-400 font-medium border-b border-gray-100">
                                                <tr>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Template</th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Description</th>
                                                    <th className="py-3 font-normal text-xs uppercase tracking-wide">Options</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                <tr className="border-b border-gray-50 hover:bg-gray-50">
                                                    <td className="py-4 pr-4 font-bold text-gray-600">lease</td>
                                                    <td className="py-4 pr-4 text-gray-500">This is the default lease document template</td>
                                                    <td className="py-4">
                                                        <select className="border border-gray-300 rounded text-sm py-1 px-2 bg-white focus:ring-[#1a237e] focus:border-[#1a237e]">
                                                            <option>Options</option>
                                                            <option>Edit</option>
                                                            <option>Delete</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentsSettingsView;
