
import React from 'react';
import CommunicationsFiltersPanel from './CommunicationsFiltersPanel';
import CommunicationsSummary from './CommunicationsSummary';
import CommunicationsTable from './CommunicationsTable';

const CommunicationsView: React.FC = () => {
    return (
        <div className="animate-fadeIn relative min-h-full">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <CommunicationsFiltersPanel />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <CommunicationsSummary />
                    <CommunicationsTable />
                </div>
            </div>
        </div>
    );
};

export default CommunicationsView;
