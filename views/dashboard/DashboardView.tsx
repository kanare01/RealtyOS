
import React from 'react';
import Onboarding from './Onboarding';
import StatCard from './StatCard';
import PaymentsInvoicesCard from './PaymentsInvoicesCard';
import OccupancyCard from './OccupancyCard';
import ArrearsOverview from './ArrearsOverview';
import MoreActions from './MoreActions';
import BalanceCard from './BalanceCard';
import RevenueChart from './RevenueChart';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface DashboardViewProps {
    setCurrentView?: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentView }) => {
    const { tenants, invoices, loading } = useData();

    const totalArrears = tenants.reduce((sum, t) => sum + (t.balance || 0), 0);
    const tenantsWithArrears = tenants.filter(t => (t.balance || 0) > 0).length;
    
    const totalAdvance = tenants.reduce((sum, t) => sum + (t.balance && t.balance < 0 ? Math.abs(t.balance) : 0), 0);
    const tenantsWithAdvance = tenants.filter(t => (t.balance || 0) < 0).length;

    if (loading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a237e]"></div>
        </div>;
    }

    return (
        <div className="animate-fadeIn space-y-6">
            <Onboarding onViewProgress={() => setCurrentView && setCurrentView('Getting Started')} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    title="Tenant Arrears (KES)"
                    value={totalArrears.toLocaleString()}
                    subtext={`${tenantsWithArrears} tenants with arrears`}
                />
                <StatCard
                    title="Tenant Advance Payments (KES)"
                    value={totalAdvance.toLocaleString()}
                    subtext={`${tenantsWithAdvance} tenants with advance payments`}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PaymentsInvoicesCard />
                <OccupancyCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ArrearsOverview />
                </div>
                <div className="lg:col-span-2">
                    <MoreActions />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BalanceCard 
                    title="Subscription Balance"
                    balance="0.00 KES"
                    expiry="23/10/2025"
                    buttonText="Pay Subscription"
                />
                 <BalanceCard 
                    title="SMS Balance"
                    balance="0.00 KES"
                    lastPurchase="N/A"
                    buttonText="Buy SMS"
                />
            </div>
            
            <RevenueChart />
        </div>
    );
};

export default DashboardView;

