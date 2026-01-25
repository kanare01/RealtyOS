
import React from 'react';
import Onboarding from './Onboarding';
import StatCard from './StatCard';
import PaymentsInvoicesCard from './PaymentsInvoicesCard';
import OccupancyCard from './OccupancyCard';
import ArrearsOverview from './ArrearsOverview';
import MoreActions from './MoreActions';
import BalanceCard from './BalanceCard';
import RevenueChart from './RevenueChart';
import RecentPaymentsTable from '../../components/dashboard/RecentPaymentsTable';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface DashboardViewProps {
    setCurrentView?: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentView }) => {
    const { tenants, payments } = useData();

    // Calculate real stats
    const totalArrears = tenants.reduce((sum, t) => sum + (t.balance && t.balance > 0 ? t.balance : 0), 0);
    const tenantsWithArrears = tenants.filter(t => (t.balance || 0) > 0).length;
    
    const totalAdvance = tenants.reduce((sum, t) => sum + (t.balance && t.balance < 0 ? Math.abs(t.balance) : 0), 0);
    const tenantsWithAdvance = tenants.filter(t => (t.balance || 0) < 0).length;

    // Helper to safely call setCurrentView
    const handleNavigate = (view: View) => {
        if (setCurrentView) {
            setCurrentView(view);
        }
    };

    return (
        <div className="animate-fadeIn space-y-6 pb-20">
            <Onboarding onViewProgress={() => handleNavigate('Getting Started')} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    title="Tenant Arrears (KES)"
                    value={totalArrears.toLocaleString()}
                    subtext={`${tenantsWithArrears} tenants with arrears`}
                    onViewDetails={() => handleNavigate('Tenants')}
                    onSendReminders={() => handleNavigate('Communication')}
                    onViewInsights={() => handleNavigate('Insights (beta)')}
                />
                <StatCard
                    title="Tenant Advance Payments (KES)"
                    value={totalAdvance.toLocaleString()}
                    subtext={`${tenantsWithAdvance} tenants with advance payments`}
                    onViewDetails={() => handleNavigate('Tenants')}
                    onSendReminders={() => handleNavigate('Communication')}
                    onViewInsights={() => handleNavigate('Insights (beta)')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PaymentsInvoicesCard 
                    onRecordPayment={() => handleNavigate('PaymentForm')}
                    onViewDetails={() => handleNavigate('Invoices')}
                />
                <OccupancyCard 
                    onAddTenant={() => handleNavigate('TenantForm')}
                    onManageTenants={() => handleNavigate('Tenants')}
                    onViewInsights={() => handleNavigate('Insights (beta)')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ArrearsOverview onViewAll={() => handleNavigate('Tenants')} />
                </div>
                <div className="lg:col-span-2">
                    <MoreActions setCurrentView={handleNavigate} />
                </div>
            </div>

            {/* New Recent Payments Section */}
            <div className="grid grid-cols-1 gap-6">
                <RecentPaymentsTable />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BalanceCard 
                    title="Subscription Balance"
                    balance="0.00 KES"
                    expiry="23/10/2025"
                    buttonText="Pay Subscription"
                    onAction={() => handleNavigate('Billing')}
                />
                 <BalanceCard 
                    title="SMS Balance"
                    balance="0.00 KES"
                    lastPurchase="N/A"
                    buttonText="Buy SMS"
                    onAction={() => handleNavigate('Billing')}
                />
            </div>
            
            <RevenueChart />
        </div>
    );
};

export default DashboardView;
