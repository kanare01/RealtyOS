
import React from 'react';
import DashboardCard from '../../components/shared/DashboardCard';
import DonutChart from '../../components/shared/DonutChart';

interface OccupancyCardProps {
    onAddTenant?: () => void;
    onManageTenants?: () => void;
    onViewInsights?: () => void;
}

const OccupancyCard: React.FC<OccupancyCardProps> = ({ onAddTenant, onManageTenants, onViewInsights }) => {
    return (
        <DashboardCard title="Occupancy">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Vacant</p>
                    <p className="font-bold text-xl">0</p>
                    <p className="text-gray-500 text-sm mt-2">Occupied</p>
                    <p className="font-bold text-xl">0</p>
                </div>
                <DonutChart percentage={0} />
                <div className="flex flex-col space-y-2">
                     <button 
                        onClick={onAddTenant}
                        className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                    >
                        Add Tenants
                    </button>
                     <button 
                        onClick={onManageTenants}
                        className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                    >
                        Manage Tenants
                    </button>
                </div>
            </div>
             <div className="text-left mt-4">
                <button 
                    onClick={onViewInsights}
                    className="text-sm text-blue-600 hover:underline"
                >
                    View Insights &rarr;
                </button>
            </div>
        </DashboardCard>
    );
};

export default OccupancyCard;
