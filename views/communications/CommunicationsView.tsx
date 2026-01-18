
import React, { useState, useMemo } from 'react';
import CommunicationsFiltersPanel from './CommunicationsFiltersPanel';
import CommunicationsSummary from './CommunicationsSummary';
import CommunicationsTable from './CommunicationsTable';
import NewMessageModal from './NewMessageModal';
import { useData } from '../../contexts/DataContext';

const CommunicationsView: React.FC = () => {
    const { messages, properties, tenants } = useData();
    const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

    // Filter States
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedUnit, setSelectedUnit] = useState(''); // Added logic for unit inside filter panel, but simple prop filtering here
    const [recipientType, setRecipientType] = useState<string[]>(['Tenant', 'Team']);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [messageType, setMessageType] = useState<string[]>([]);

    const filteredMessages = useMemo(() => {
        return messages.filter(msg => {
            // Date Filter
            if (dateRange.start && new Date(msg.date) < new Date(dateRange.start)) return false;
            if (dateRange.end && new Date(msg.date) > new Date(dateRange.end)) return false;

            // Property Filter
            if (selectedProperty && selectedProperty !== 'All Properties' && msg.property !== selectedProperty) return false;

            // Recipient Type Filter (Group)
            if (recipientType.length > 0) {
                const isTenant = msg.recipientGroup === 'Tenant' || msg.recipientGroup === 'All Tenants';
                const isTeam = msg.recipientGroup === 'Team';
                
                let match = false;
                if (recipientType.includes('Tenant') && isTenant) match = true;
                if (recipientType.includes('Team') && isTeam) match = true;
                if (!match) return false;
            }

            // Status Filter
            if (statusFilter.length > 0 && !statusFilter.includes(msg.status)) return false;

            // Type Filter
            if (messageType.length > 0 && !messageType.includes(msg.type)) return false;

            return true;
        });
    }, [messages, dateRange, selectedProperty, recipientType, statusFilter, messageType]);

    return (
        <div className="animate-fadeIn relative min-h-full">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setIsNewMessageOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Message
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <CommunicationsFiltersPanel 
                        properties={properties}
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        selectedProperty={selectedProperty}
                        onPropertyChange={setSelectedProperty}
                        recipientType={recipientType}
                        onRecipientTypeChange={setRecipientType}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        messageType={messageType}
                        onMessageTypeChange={setMessageType}
                    />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <CommunicationsSummary messages={filteredMessages} />
                    <CommunicationsTable messages={filteredMessages} />
                </div>
            </div>

            {isNewMessageOpen && (
                <NewMessageModal 
                    onClose={() => setIsNewMessageOpen(false)} 
                    properties={properties}
                    tenants={tenants}
                />
            )}
        </div>
    );
};

export default CommunicationsView;
