
import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface BackupSettingsViewProps {
    setCurrentView: (view: View) => void;
}

interface BackupLog {
    id: number;
    date: string;
    property: string;
    size: string;
    status: 'Completed' | 'Failed';
}

const BackupSettingsView: React.FC<BackupSettingsViewProps> = ({ setCurrentView }) => {
    const { properties } = useData();
    const [selectedProperty, setSelectedProperty] = useState('All Properties');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Simulated backup history
    const [backupHistory, setBackupHistory] = useState<BackupLog[]>([
        { id: 1, date: '2025-10-20 14:30', property: 'All Properties', size: '2.4 MB', status: 'Completed' },
        { id: 2, date: '2025-09-20 09:15', property: 'All Properties', size: '2.1 MB', status: 'Completed' },
    ]);

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

    const handleGenerateBackup = () => {
        setIsGenerating(true);
        
        // Simulate network delay / processing time
        setTimeout(() => {
            const date = new Date();
            const timestamp = date.toISOString().replace(/[:.]/g, '-');
            const safePropertyName = selectedProperty.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filename = `backup-${safePropertyName}-${timestamp}.json`;
            
            // Create dummy content for the backup file
            const backupData = {
                meta: {
                    generatedAt: date.toISOString(),
                    scope: selectedProperty,
                    version: "1.0"
                },
                data: "This is a simulated backup file containing tenant records, payment history, and property details."
            };

            // Trigger file download
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Update history
            const newLog: BackupLog = {
                id: Date.now(),
                date: date.toLocaleString(),
                property: selectedProperty,
                size: `${(blob.size / 1024).toFixed(2)} KB`,
                status: 'Completed'
            };
            
            setBackupHistory([newLog, ...backupHistory]);
            setIsGenerating(false);
        }, 2000);
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
                                    item.view === 'Backup'
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
                    {/* Generate Backup Card */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-800">Back up your data</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Generate a downloadable file of tenant, units, payments, invoices, and utilities data.
                            </p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Scope
                                </label>
                                <select 
                                    value={selectedProperty}
                                    onChange={(e) => setSelectedProperty(e.target.value)}
                                    className="w-full sm:w-64 border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-gray-50 border"
                                >
                                    <option>All Properties</option>
                                    {properties.map(prop => (
                                        <option key={prop.id} value={prop.name}>{prop.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <button 
                                onClick={handleGenerateBackup}
                                disabled={isGenerating}
                                className={`bg-[#1a237e] hover:bg-blue-900 text-white font-medium py-2 px-4 rounded shadow-sm text-sm transition-colors flex items-center ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    'Generate & Download'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Recent Backups Table */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-medium text-gray-800">Recent Backups</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Scope</th>
                                        <th className="px-6 py-3">Size</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {backupHistory.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{log.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{log.property}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono text-xs">{log.size}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button className="text-blue-600 hover:text-blue-900 text-xs font-medium">
                                                    Download Again
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {backupHistory.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                No backups generated yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackupSettingsView;
