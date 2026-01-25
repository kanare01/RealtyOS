import React from 'react';
import DashboardCard from '../../components/shared/DashboardCard';

const actions = [
    "Add Utilities", "Add Invoice", "Bulk Add Invoices", "Upload Bank Statement",
    "Add Tenant", "Add Unit", "Add Property", "Shift Tenant", "Generate Rent Invoices",
    "Generate Other Bills Invoices", "Send Message", "Add To Team"
];

const MoreActions: React.FC = () => {
    return (
        <DashboardCard title="More Actions">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {actions.map(action => (
                    <button key={action} className="px-3 py-2 text-center text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors">
                        {action}
                    </button>
                ))}
            </div>
        </DashboardCard>
    );
};

export default MoreActions;