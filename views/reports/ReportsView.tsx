
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';

interface ReportConfig {
    title: string;
    description: string;
    icon: string;
    type: 'revenue' | 'occupancy' | 'arrears' | 'lease' | 'maintenance' | 'payments';
}

const reports: ReportConfig[] = [
    { title: 'Monthly Revenue Summary', description: 'Detailed breakdown of revenue by property and unit.', icon: 'cash', type: 'revenue' },
    { title: 'Occupancy Report', description: 'View current and historical occupancy rates across the portfolio.', icon: 'users', type: 'occupancy' },
    { title: 'Tenant Arrears', description: 'List of all tenants with outstanding balances.', icon: 'warning', type: 'arrears' },
    { title: 'Lease Expiration Report', description: 'Upcoming lease expirations for the next 30, 60, and 90 days.', icon: 'calendar', type: 'lease' },
    { title: 'Maintenance & Expense Log', description: 'Complete log of all maintenance requests and associated costs.', icon: 'clipboard', type: 'maintenance' },
    { title: 'Payment History', description: 'Full transaction history for a specified date range.', icon: 'document', type: 'payments' },
];

const ReportCard: React.FC<{ 
    report: ReportConfig; 
    onDownload: (type: string, title: string) => void;
    isLoading: boolean;
}> = ({ report, onDownload, isLoading }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
            <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-50 rounded-lg text-[#1a237e] mr-3">
                    {report.icon === 'cash' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    {report.icon === 'users' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    {report.icon === 'warning' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                    {report.icon === 'calendar' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    {report.icon === 'clipboard' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                    {report.icon === 'document' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{report.title}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{report.description}</p>
        </div>
        <button 
            onClick={() => onDownload(report.type, report.title)}
            disabled={isLoading}
            className={`w-full mt-2 font-semibold py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center ${isLoading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 hover:bg-blue-100 text-[#1a237e]'}`}
        >
            {isLoading ? (
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            )}
            {isLoading ? 'Generating...' : 'Download CSV'}
        </button>
    </div>
);

const ReportsView: React.FC = () => {
    const { payments, expenses, tenants, maintenanceRequests, properties } = useData();
    const [loadingReport, setLoadingReport] = useState<string | null>(null);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const generateCSV = (data: any[], filename: string) => {
        if (data.length === 0) {
            setNotification({ message: 'No data available to generate this report.', type: 'error' });
            return;
        }

        // Handle potential null/undefined values during CSV generation
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj).map(val => {
            if (val === null || val === undefined) return '""';
            return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')).join('\n');
        
        const csvContent = `${headers}\n${rows}`;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownload = (type: string, title: string) => {
        setLoadingReport(type);
        setNotification(null);

        // Simulate processing time
        setTimeout(() => {
            try {
                let data: any[] = [];
                const timestamp = new Date().toISOString().slice(0,10);

                switch(type) {
                    case 'revenue':
                        data = payments.map(p => ({ Date: p.date, Property: p.propertyName, Unit: p.unitName, Amount: p.amount, Tenant: p.tenantName }));
                        break;
                    case 'occupancy':
                        data = properties.map(p => ({ Property: p.name, Units: p.units, Occupancy: `${p.occupancy}%` }));
                        break;
                    case 'arrears':
                        data = tenants.filter(t => (t.balance || 0) > 0).map(t => ({ Name: t.name, Property: t.property, Unit: t.unit, Balance: t.balance }));
                        break;
                    case 'lease':
                        data = tenants.map(t => ({ Name: t.name, Property: t.property, LeaseEnd: t.leaseEndDate }));
                        break;
                    case 'maintenance':
                        data = maintenanceRequests.map(r => ({ Date: r.date, Title: r.title, Cost: r.cost, Status: r.status }));
                        break;
                    case 'payments':
                        data = payments.map(p => ({ ID: p.paymentId, Date: p.date, Amount: p.amount, Method: p.method }));
                        break;
                }

                if (data.length > 0) {
                    generateCSV(data, `${title.replace(/\s+/g, '_')}_${timestamp}.csv`);
                    setNotification({ message: `${title} generated successfully.`, type: 'success' });
                } else {
                    setNotification({ message: `No data found for ${title}.`, type: 'error' });
                }
            } catch (e) {
                setNotification({ message: 'Failed to generate report.', type: 'error' });
            } finally {
                setLoadingReport(null);
                setTimeout(() => setNotification(null), 3000);
            }
        }, 1500);
    };

    return (
        <div className="animate-fadeIn relative">
            {notification && (
                <div className={`fixed top-24 right-4 md:right-10 z-50 px-4 py-3 rounded shadow-lg border ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} animate-fadeIn`}>
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            <div className="text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-1">Reports</h2>
                <p className="text-gray-500">Generate and download key business reports.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map(report => (
                    <ReportCard 
                        key={report.title} 
                        report={report} 
                        onDownload={handleDownload}
                        isLoading={loadingReport === report.type}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReportsView;
