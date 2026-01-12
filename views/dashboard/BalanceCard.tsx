import React from 'react';
import DashboardCard from '../../components/shared/DashboardCard';

interface BalanceCardProps {
    title: string;
    balance: string;
    expiry?: string;
    lastPurchase?: string;
    buttonText: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ title, balance, expiry, lastPurchase, buttonText }) => {
    return (
        <DashboardCard title={title}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Balance</p>
                    <p className="text-xl font-bold">{balance}</p>
                </div>
                <div>
                    {expiry && <p className="text-sm text-gray-500">Subscription Expiry</p>}
                    {lastPurchase && <p className="text-sm text-gray-500">Last Purchase</p>}
                    <p className="text-xl font-bold">{expiry || lastPurchase}</p>
                </div>
                 <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                    {buttonText}
                </button>
            </div>
        </DashboardCard>
    );
};

export default BalanceCard;