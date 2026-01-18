
import React, { useEffect } from 'react';
import Onboarding from './Onboarding';
import StatCard from './StatCard';
import PaymentsInvoicesCard from './PaymentsInvoicesCard';
import OccupancyCard from './OccupancyCard';
import ArrearsOverview from './ArrearsOverview';
import MoreActions from './MoreActions';
import BalanceCard from './BalanceCard';
import RevenueChart from './RevenueChart';
import RecentPaymentsTable from '../../components/dashboard/RecentPaymentsTable';
import RecentActivityFeed from '../../components/dashboard/RecentActivityFeed';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface DashboardViewProps {
    setCurrentView?: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentView }) => {
    const { dashboardStats, billing } = useData();

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
                    value={dashboardStats.totalArrears.toLocaleString()}
                    subtext={`${dashboardStats.tenantsArrearsCount} tenants with arrears`}
                    onViewDetails={() => handleNavigate('Tenants')}
                    onSendReminders={() => handleNavigate('Communication')}
                    onViewInsights={() => handleNavigate('Insights (beta)')}
                />
                <StatCard
                    title="Tenant Advance Payments (KES)"
                    value={dashboardStats.totalAdvance.toLocaleString()}
                    subtext={`${dashboardStats.tenantsAdvanceCount} tenants with advance payments`}
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

            {/* Monitoring Section: Recent Payments & Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentPaymentsTable />
                <RecentActivityFeed />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BalanceCard 
                    title="Subscription Balance"
                    balance={`${billing.subscription_due} KES`}
                    expiry={billing.subscription_expiry || "N/A"}
                    buttonText="Pay Subscription"
                    onAction={() => handleNavigate('Billing')}
                />
                 <BalanceCard 
                    title="SMS Balance"
                    balance={`${billing.sms_balance} KES`}
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
