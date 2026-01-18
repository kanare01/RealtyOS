
import React, { useEffect, useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';
import { API_BASE_URL } from '../../config';

interface SystemStatusViewProps {
    setCurrentView: (view: View) => void;
}

interface Job {
    id: string;
    next_run_time: string;
    func_name: string;
}

interface SystemHealth {
    database: string;
    scheduler: string;
    jobs: Job[];
    server_time: string;
    version: string;
}

const SystemStatusView: React.FC<SystemStatusViewProps> = ({ setCurrentView }) => {
    const { addNotification, performMaintenance, triggerSystemJob } = useData();
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [maintenanceLoading, setMaintenanceLoading] = useState<string | null>(null);
    const [jobLoading, setJobLoading] = useState<string | null>(null);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/system/status`, {
                headers: { 'Authorization': token ? `Bearer ${token}` : '' }
            });
            if (res.ok) {
                setHealth(await res.json());
            } else {
                addNotification("Failed to fetch system status", "error");
            }
        } catch (e) {
            addNotification("Network error checking system status", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleMaintenance = async (action: 'prune_logs' | 'clear_cache') => {
        if (!confirm("Are you sure? This action is irreversible.")) return;
        
        setMaintenanceLoading(action);
        await performMaintenance(action);
        setMaintenanceLoading(null);
    };

    const handleTriggerJob = async (jobId: string) => {
        setJobLoading(jobId);
        await triggerSystemJob(jobId);
        setJobLoading(null);
    };

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
        { label: 'User Feedback', view: 'User Feedback' },
        { label: 'System Status', view: 'System Status' },
    ];

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
                                    item.view === 'System Status'
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
                        <h2 className="text-2xl font-medium text-gray-700">System Status</h2>
                        <button 
                            onClick={fetchStatus}
                            className="bg-white border border-[#1a237e] text-[#1a237e] hover:bg-blue-50 text-sm font-medium py-1.5 px-4 rounded shadow-sm transition-colors"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Checking system health...</div>
                    ) : health ? (
                        <div className="space-y-6">
                            {/* Health Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Database</h3>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${health.database === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-lg font-medium text-gray-800">{health.database}</span>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Job Scheduler</h3>
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-2 ${health.scheduler === 'Running' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                        <span className="text-lg font-medium text-gray-800">{health.scheduler}</span>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">API Version</h3>
                                    <span className="text-lg font-medium text-gray-800">{health.version}</span>
                                </div>
                            </div>

                            {/* Manual Job Triggers */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="font-medium text-gray-800">Manual Job Triggers</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="border border-gray-200 rounded p-4 flex flex-col">
                                        <h4 className="font-medium text-gray-800">Recurring Expenses</h4>
                                        <p className="text-xs text-gray-500 mt-1 flex-1">Process daily recurring bills due today.</p>
                                        <button 
                                            onClick={() => handleTriggerJob('daily_expenses')}
                                            disabled={!!jobLoading}
                                            className="mt-3 w-full bg-blue-50 text-blue-700 py-2 rounded text-sm font-medium hover:bg-blue-100 disabled:opacity-50"
                                        >
                                            {jobLoading === 'daily_expenses' ? 'Running...' : 'Run Now'}
                                        </button>
                                    </div>
                                    <div className="border border-gray-200 rounded p-4 flex flex-col">
                                        <h4 className="font-medium text-gray-800">Rent Generation</h4>
                                        <p className="text-xs text-gray-500 mt-1 flex-1">Generate rent invoices for all tenants (monthly task).</p>
                                        <button 
                                            onClick={() => handleTriggerJob('monthly_rent')}
                                            disabled={!!jobLoading}
                                            className="mt-3 w-full bg-blue-50 text-blue-700 py-2 rounded text-sm font-medium hover:bg-blue-100 disabled:opacity-50"
                                        >
                                            {jobLoading === 'monthly_rent' ? 'Running...' : 'Run Now'}
                                        </button>
                                    </div>
                                    <div className="border border-gray-200 rounded p-4 flex flex-col">
                                        <h4 className="font-medium text-gray-800">Check Reminders</h4>
                                        <p className="text-xs text-gray-500 mt-1 flex-1">Send lease expiration and payment reminders.</p>
                                        <button 
                                            onClick={() => handleTriggerJob('daily_reminders')}
                                            disabled={!!jobLoading}
                                            className="mt-3 w-full bg-blue-50 text-blue-700 py-2 rounded text-sm font-medium hover:bg-blue-100 disabled:opacity-50"
                                        >
                                            {jobLoading === 'daily_reminders' ? 'Running...' : 'Run Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Maintenance Controls */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="font-medium text-gray-800">Maintenance Operations</h3>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 rounded p-4 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Prune Audit Logs</h4>
                                            <p className="text-xs text-gray-500 mt-1">Remove old logs to save space (keeps last 1000).</p>
                                        </div>
                                        <button 
                                            onClick={() => handleMaintenance('prune_logs')}
                                            disabled={!!maintenanceLoading}
                                            className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            {maintenanceLoading === 'prune_logs' ? 'Pruning...' : 'Prune Logs'}
                                        </button>
                                    </div>
                                    <div className="border border-gray-200 rounded p-4 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Clear System Cache</h4>
                                            <p className="text-xs text-gray-500 mt-1">Force refresh of cached data structures.</p>
                                        </div>
                                        <button 
                                            onClick={() => handleMaintenance('clear_cache')}
                                            disabled={!!maintenanceLoading}
                                            className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                                        >
                                            {maintenanceLoading === 'clear_cache' ? 'Clearing...' : 'Clear Cache'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Scheduled Jobs */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="font-medium text-gray-800">Scheduled Background Jobs</h3>
                                </div>
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-white text-gray-500 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 font-medium">Job ID</th>
                                            <th className="p-4 font-medium">Function</th>
                                            <th className="p-4 font-medium text-right">Next Run Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600">
                                        {health.jobs.length > 0 ? (
                                            health.jobs.map(job => (
                                                <tr key={job.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                                    <td className="p-4 font-mono text-xs text-[#1a237e]">{job.id}</td>
                                                    <td className="p-4 text-xs font-mono">{job.func_name}</td>
                                                    <td className="p-4 text-right">{job.next_run_time}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="p-6 text-center text-gray-500">No active scheduled jobs.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Changelog */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="font-medium text-gray-800">Recent Updates (Changelog)</h3>
                                </div>
                                <div className="p-6">
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                                        <li><strong className="text-gray-800">v1.2.0</strong>: Manual job triggers for admins.</li>
                                        <li><strong className="text-gray-800">v1.1.0</strong>: Added Feedback system and Maintenance controls.</li>
                                        <li><strong className="text-gray-800">v1.0.0</strong>: Initial Production Release. Core property management features.</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <p className="text-xs text-gray-400 text-center pt-4">Server Time: {health.server_time}</p>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-red-500 bg-red-50 rounded border border-red-200">
                            System status unavailable. Please contact support.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SystemStatusView;
