import React from 'react';

const reports = [
    { title: 'Monthly Revenue Summary', description: 'Detailed breakdown of revenue by property and unit.', icon: 'cash' },
    { title: 'Occupancy Report', description: 'View current and historical occupancy rates across the portfolio.', icon: 'users' },
    { title: 'Tenant Arrears', description: 'List of all tenants with outstanding balances.', icon: 'warning' },
    { title: 'Lease Expiration Report', description: 'Upcoming lease expirations for the next 30, 60, and 90 days.', icon: 'calendar' },
    { title: 'Maintenance & Expense Log', description: 'Complete log of all maintenance requests and associated costs.', icon: 'clipboard' },
    { title: 'Payment History', description: 'Full transaction history for a specified date range.', icon: 'document' },
];

const ReportCard: React.FC<{title: string; description: string;}> = ({ title, description }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-between">
        <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
        </div>
        <button className="w-full mt-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download Report
        </button>
    </div>
);

const ReportsView: React.FC = () => {
  return (
    <div className="animate-fadeIn">
       <div className="text-left mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">Reports</h2>
        <p className="text-gray-500">Generate and download key business reports.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
            <ReportCard key={report.title} title={report.title} description={report.description} />
        ))}
      </div>
    </div>
  );
};

export default ReportsView;