
import React, { useState, useMemo } from 'react';
import { View } from '../../types';

interface AuditTrailSettingsViewProps {
    setCurrentView: (view: View) => void;
}

interface AuditLog {
    id: number;
    username: string;
    fullName: string;
    action: string;
    date: string; // ISO string for sorting/filtering
    description: string;
    details?: string; // For expanded view
    ipAddress?: string;
}

const mockAuditLogs: AuditLog[] = [
    { id: 1, username: 'k254', fullName: 'Kelvin Wash', action: 'created tenant', date: '2025-12-12T16:44:56', description: 'Created tenant mr Kabati in kanari Apartments (f1)', details: 'Tenant ID: 105 created.', ipAddress: '192.168.1.45' },
    { id: 2, username: 'k254', fullName: 'Kelvin Wash', action: 'created unit', date: '2025-12-12T16:44:08', description: 'Created unit f1 in kanari Apartments', details: 'Unit ID: 302, Rent: 15000', ipAddress: '192.168.1.45' },
    { id: 3, username: 'k254', fullName: 'Kelvin Wash', action: 'created property', date: '2025-12-12T16:27:51', description: 'Created property kanari Apartments', details: 'Property ID: 12', ipAddress: '192.168.1.45' },
    { id: 4, username: 'k254', fullName: 'Kelvin Wash', action: 'deleted property', date: '2025-12-12T16:27:07', description: 'Deleted property kanari Apartments', details: 'Property ID: 11 (Archived)', ipAddress: '192.168.1.45' },
    { id: 5, username: 'k254', fullName: 'Kelvin Wash', action: 'created property', date: '2025-12-12T16:26:52', description: 'Created property kanari Apartments', ipAddress: '192.168.1.45' },
    { id: 6, username: 'k254', fullName: 'Kelvin Wash', action: 'deleted property', date: '2025-12-12T16:03:46', description: 'Deleted property kanari Apartments', ipAddress: '192.168.1.45' },
    { id: 7, username: 'manager', fullName: 'Jane Doe', action: 'updated settings', date: '2025-12-12T16:03:41', description: 'Changed company address', details: 'Old: Box 1, New: Box 23', ipAddress: '10.0.0.12' },
    { id: 8, username: 'k254', fullName: 'Kelvin Wash', action: 'deleted property', date: '2025-12-12T15:42:54', description: 'Deleted property kanari Apartments', ipAddress: '192.168.1.45' },
    { id: 9, username: 'k254', fullName: 'Kelvin Wash', action: 'Archived tenant', date: '2025-12-12T15:42:29', description: 'Archived tenant mr kanare in kanari Apartments (f1)', ipAddress: '192.168.1.45' },
    { id: 10, username: 'k254', fullName: 'Kelvin Wash', action: 'created tenant', date: '2025-12-12T15:27:59', description: 'Created tenant mr kanare in kanari Apartments (f1)', ipAddress: '192.168.1.45' },
    { id: 11, username: 'admin', fullName: 'System Admin', action: 'system backup', date: '2025-12-11T09:00:00', description: 'Automated daily backup completed', details: 'Size: 25MB', ipAddress: '127.0.0.1' },
    { id: 12, username: 'manager', fullName: 'Jane Doe', action: 'login', date: '2025-12-11T08:30:00', description: 'User logged in successfully', ipAddress: '10.0.0.12' },
];

const CollapsibleCard: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean; className?: string }> = ({ title, children, defaultOpen = true, className = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`bg-white border border-gray-200 rounded-lg shadow-sm mb-6 ${className}`}>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
                <h3 className="text-lg font-medium text-[#1a237e]">{title}</h3>
                <button className="text-[#1a237e] font-bold text-xl hover:text-blue-900">
                    {isOpen ? '−' : '+'}
                </button>
            </div>
            {isOpen && (
                <div className="p-6 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};

const AuditTrailSettingsView: React.FC<AuditTrailSettingsViewProps> = ({ setCurrentView }) => {
    // Filter State
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedUser, setSelectedUser] = useState('All Users');
    
    // Pagination & UI State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

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

    // Get unique users for dropdown
    const users = useMemo(() => {
        const unique = new Set(mockAuditLogs.map(log => log.username));
        return Array.from(unique);
    }, []);

    // Filter Logic
    const filteredLogs = useMemo(() => {
        return mockAuditLogs.filter(log => {
            // User Filter
            if (selectedUser !== 'All Users' && log.username !== selectedUser) {
                return false;
            }
            // Date Range Filter
            if (startDate) {
                const logDate = new Date(log.date);
                const start = new Date(startDate);
                if (logDate < start) return false;
            }
            if (endDate) {
                const logDate = new Date(log.date);
                const end = new Date(endDate);
                // Set end date to end of day
                end.setHours(23, 59, 59, 999);
                if (logDate > end) return false;
            }
            return true;
        });
    }, [selectedUser, startDate, endDate]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const displayedLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleRowExpansion = (id: number) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const handleResetFilters = () => {
        setStartDate('');
        setEndDate('');
        setSelectedUser('All Users');
        setCurrentPage(1);
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
                                    item.view === 'Audit Trail'
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
                    {/* Filters Card */}
                    <CollapsibleCard title="Filters">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                                    <div className="space-y-3">
                                        <input 
                                            type="date" 
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-white border"
                                            placeholder="Start Date"
                                        />
                                        <input 
                                            type="date" 
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-white border"
                                            placeholder="End Date"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                                    <select 
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-white border text-gray-600"
                                    >
                                        <option value="All Users">All Users</option>
                                        {users.map(u => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    onClick={handleResetFilters}
                                    className="text-sm text-[#1a237e] hover:underline"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </CollapsibleCard>

                    {/* Audit Trail Table Card */}
                    <CollapsibleCard title="Audit Trail">
                        <div className="overflow-x-auto min-h-[300px]">
                            <table className="min-w-full text-sm text-left">
                                <thead className="text-gray-400 font-normal border-b border-gray-100 bg-gray-50">
                                    <tr>
                                        <th className="py-3 pl-4 pr-2 font-normal text-xs text-[#1a237e] w-10 text-center">[+]</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500 uppercase">Username</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500 uppercase">Full Name</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500 uppercase">Action Taken</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500 uppercase">Date and Time</th>
                                        <th className="py-3 font-normal text-xs text-gray-500 uppercase">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    {displayedLogs.map((log) => (
                                        <React.Fragment key={log.id}>
                                            <tr className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${expandedRowId === log.id ? 'bg-blue-50/30' : ''}`}>
                                                <td 
                                                    className="py-4 pl-4 pr-2 text-[#1a237e] font-bold cursor-pointer text-center select-none"
                                                    onClick={() => toggleRowExpansion(log.id)}
                                                >
                                                    {expandedRowId === log.id ? '−' : '+'}
                                                </td>
                                                <td className="py-4 pr-4 font-medium text-gray-700">{log.username}</td>
                                                <td className="py-4 pr-4 text-gray-500">{log.fullName}</td>
                                                <td className="py-4 pr-4 text-gray-700">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="py-4 pr-4 text-gray-500 whitespace-nowrap">{formatDate(log.date)}</td>
                                                <td className="py-4 text-gray-500 truncate max-w-xs" title={log.description}>{log.description}</td>
                                            </tr>
                                            {expandedRowId === log.id && (
                                                <tr className="bg-gray-50 border-b border-gray-100 animate-fadeIn">
                                                    <td colSpan={6} className="p-4 pl-12 text-xs text-gray-600">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <strong className="text-gray-800">Additional Details:</strong>
                                                                <p className="mt-1">{log.details || 'No additional details available.'}</p>
                                                            </div>
                                                            <div>
                                                                <strong className="text-gray-800">Technical Info:</strong>
                                                                <p className="mt-1 font-mono text-gray-500">IP: {log.ipAddress || 'Unknown'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {displayedLogs.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-gray-500">
                                                No logs found matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-4">
                            <div className="mb-2 sm:mb-0">
                                Showing <span className="font-medium">{filteredLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredLogs.length)}</span> of <span className="font-medium">{filteredLogs.length}</span> Results
                            </div>
                            
                            <div className="flex items-center space-x-1">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ‹
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded font-medium transition-colors ${
                                            currentPage === page 
                                                ? 'bg-[#1a237e] text-white border border-[#1a237e]' 
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </CollapsibleCard>
                </div>
            </div>
        </div>
    );
};

export default AuditTrailSettingsView;
