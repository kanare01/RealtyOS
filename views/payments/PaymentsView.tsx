
import React from 'react';
import PaymentsFiltersPanel from './PaymentsFiltersPanel';
import PaymentsSummaryCard from './PaymentsSummaryCard';
import PaymentsTable from './PaymentsTable';
import { View } from '../../types';

interface PaymentsViewProps {
    setCurrentView: (view: View) => void;
}

const PaymentsView: React.FC<PaymentsViewProps> = ({ setCurrentView }) => {
    return (
        <div className="animate-fadeIn relative min-h-full">
            <div className="flex justify-end items-center mb-4 space-x-2">
                <button 
                    onClick={() => setCurrentView('PaymentForm')}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm"
                    id="payments-view-record-btn"
                >
                    Record Payment
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors shadow-sm">
                    Upload Bank Statement
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <PaymentsFiltersPanel />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <PaymentsSummaryCard />
                    <PaymentsTable />
                </div>
            </div>
        </div>
    );
};

export default PaymentsView;