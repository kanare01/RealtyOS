
import React, { useState } from 'react';
import TenantStatement from './statements/TenantStatement';
import PropertyStatement from './statements/PropertyStatement';
import ArrearsReport from './statements/ArrearsReport';
import ExpensesReport from './statements/ExpensesReport';
import MonthOnMonthReport from './statements/MonthOnMonthReport';
import YearOnYearReport from './statements/YearOnYearReport';
import PropertyGroupingReport from './statements/PropertyGroupingReport';

type ReportType = 
    | 'Tenant Statement'
    | 'Property Statement'
    | 'Arrears Report'
    | 'Expenses Report'
    | 'Month on Month Report'
    | 'Year on Year Report'
    | 'Property Grouping Report';

const StatementsView: React.FC = () => {
    const [activeReport, setActiveReport] = useState<ReportType>('Tenant Statement');

    const reports: ReportType[] = [
        'Tenant Statement',
        'Property Statement',
        'Arrears Report',
        'Expenses Report',
        'Month on Month Report',
        'Year on Year Report',
        'Property Grouping Report'
    ];

    const renderReport = () => {
        switch (activeReport) {
            case 'Tenant Statement': return <TenantStatement />;
            case 'Property Statement': return <PropertyStatement />;
            case 'Arrears Report': return <ArrearsReport />;
            case 'Expenses Report': return <ExpensesReport />;
            case 'Month on Month Report': return <MonthOnMonthReport />;
            case 'Year on Year Report': return <YearOnYearReport />;
            case 'Property Grouping Report': return <PropertyGroupingReport />;
            default: return <TenantStatement />;
        }
    };

    return (
        <div className="animate-fadeIn flex flex-col md:flex-row gap-8 min-h-[calc(100vh-100px)]">
            {/* Sidebar for Reports */}
            <div className="w-full md:w-64 flex-shrink-0">
                <nav className="space-y-1">
                    {reports.map((report) => (
                        <button
                            key={report}
                            onClick={() => setActiveReport(report)}
                            className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                                activeReport === report
                                    ? 'bg-[#E8EAF6] text-[#1a237e]'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {report}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                {renderReport()}
            </div>
        </div>
    );
};

export default StatementsView;
