
import React, { useState, useMemo } from 'react';
import MaintenanceFiltersPanel from './MaintenanceFiltersPanel';
import MaintenanceSummaryCard from './MaintenanceSummaryCard';
import MaintenanceTable from './MaintenanceTable';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface MaintenanceViewProps {
    setCurrentView: (view: View) => void;
}

const MaintenanceView: React.FC<MaintenanceViewProps> = ({ setCurrentView }) => {
    const { maintenanceRequests, properties, setEditingMaintenanceRequest } = useData();
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string[]>(['Open', 'In Progress']);

    const handleAddMaintenance = () => {
        setEditingMaintenanceRequest(null);
        setCurrentView('MaintenanceForm');
    };

    const filteredRequests = useMemo(() => {
        return maintenanceRequests.filter(req => {
            if (selectedProperty && selectedProperty !== 'All Properties' && req.propertyName !== selectedProperty) {
                return false;
            }
            if (selectedStatus.length > 0 && !selectedStatus.includes(req.status)) {
                return false;
            }
            return true;
        });
    }, [maintenanceRequests, selectedProperty, selectedStatus]);

    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex justify-end items-center mb-6">
                <button 
                    onClick={handleAddMaintenance}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Maintenance
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <MaintenanceFiltersPanel 
                        properties={properties}
                        selectedProperty={selectedProperty}
                        onPropertyChange={setSelectedProperty}
                        selectedStatus={selectedStatus}
                        onStatusChange={setSelectedStatus}
                    />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <MaintenanceSummaryCard requests={maintenanceRequests} />
                    <MaintenanceTable 
                        requests={filteredRequests} 
                        setCurrentView={setCurrentView}
                    />
                </div>
            </div>
        </div>
    );
};

export default MaintenanceView;
