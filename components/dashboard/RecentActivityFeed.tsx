
import React from 'react';
import DashboardCard from '../shared/DashboardCard';
import { useData } from '../../contexts/DataContext';

const RecentActivityFeed: React.FC = () => {
    const { auditLogs } = useData();
    // Show top 5 most recent logs
    const recentLogs = auditLogs ? auditLogs.slice(0, 5) : [];

    const formatTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    return (
        <DashboardCard title="System Activity">
            <div className="flow-root">
                <ul className="-mb-8">
                    {recentLogs.length > 0 ? (
                        recentLogs.map((log, logIdx) => (
                            <li key={log.id}>
                                <div className="relative pb-8">
                                    {logIdx !== recentLogs.length - 1 ? (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                                log.action.includes('delete') ? 'bg-red-100' : 
                                                log.action.includes('create') ? 'bg-green-100' : 'bg-blue-100'
                                            }`}>
                                                <svg className={`h-5 w-5 ${
                                                    log.action.includes('delete') ? 'text-red-600' : 
                                                    log.action.includes('create') ? 'text-green-600' : 'text-blue-600'
                                                }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-medium text-gray-900 capitalize">{log.username}</span> {log.action}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate max-w-[200px]">{log.description}</p>
                                            </div>
                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                <time dateTime={log.date}>{formatTime(log.date)}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div className="text-center py-6 text-sm text-gray-500">
                            No recent activity found.
                        </div>
                    )}
                </ul>
            </div>
            <div className="mt-4 border-t pt-2">
                <a href="#" className="text-xs text-blue-600 hover:underline">View Full Audit Trail &rarr;</a>
            </div>
        </DashboardCard>
    );
};

export default RecentActivityFeed;
