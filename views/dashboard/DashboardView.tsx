
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

interface DashboardViewProps {
    setCurrentView?: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setCurrentView }) => {
    return (
        <div className="animate-fadeIn space-y-6">
            <Onboarding onViewProgress={() => setCurrentView && setCurrentView('Getting Started')} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    title="Tenant Arrears (KES)"
                    value="0.00"
                    subtext="0 tenants with arrears"
                />
                <StatCard
                    title="Tenant Advance Payments (KES)"
                    value="0.00"
                    subtext="0 tenants with advance payments"
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
