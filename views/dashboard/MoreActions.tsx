
import React from 'react';
import DashboardCard from '../../components/shared/DashboardCard';
import { View } from '../../types';

interface MoreActionsProps {
    setCurrentView: (view: View) => void;
}

const actions = [
    { label: "Add Utilities", view: 'Utilities' },
    { label: "Add Invoice", view: 'Invoices' },
    { label: "Bulk Add Invoices", view: 'Invoices' },
    { label: "Upload Bank Statement", view: 'Payments' },
    { label: "Add Tenant", view: 'TenantForm' },
    { label: "Add Unit", view: 'UnitForm' },
    { label: "Add Property", view: 'PropertyForm' },
    { label: "Shift Tenant", view: 'Tenants' },
    { label: "Generate Rent Invoices", view: 'Invoices' },
    { label: "Generate Other Bills Invoices", view: 'Invoices' },
    { label: "Send Message", view: 'Communication' },
    { label: "Add To Team", view: 'Team' }
];

const MoreActions: React.FC<MoreActionsProps> = ({ setCurrentView }) => {
    return (
        <DashboardCard title="More Actions">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {actions.map((action, index) => (
                    <button 
                        key={index}
                        onClick={() => setCurrentView(action.view as View)}
                        className="px-3 py-2 text-center text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors truncate"
                        title={action.label}
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </DashboardCard>
    );
};

export default MoreActions;
