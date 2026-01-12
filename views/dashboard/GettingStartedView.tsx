
import React, { useEffect, useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface GettingStartedViewProps {
    setCurrentView?: (view: View) => void;
}

const Step: React.FC<{
    title: string;
    description: string;
    completedPercentage: number;
    italicSuffix?: string;
    onContinue?: () => void;
}> = ({ title, description, completedPercentage, italicSuffix, onContinue }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-100 last:border-0 gap-4">
            <div>
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                    {description} {italicSuffix && <span className="italic">{italicSuffix}</span>}
                </p>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end min-w-[100px]">
                    <div className="w-24 bg-gray-200 rounded-full h-3 mb-1">
                        <div 
                            className="bg-[#1a237e] h-3 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${completedPercentage}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium mt-1">{completedPercentage}% completed</span>
                </div>
                <button 
                    onClick={onContinue}
                    className={`px-6 py-2 text-sm font-medium border rounded transition-colors whitespace-nowrap ${
                        completedPercentage === 100 
                        ? 'text-green-600 border-green-600 hover:bg-green-50 bg-white'
                        : 'text-[#1a237e] border-[#1a237e] hover:bg-blue-50 bg-white'
                    }`}
                >
                    {completedPercentage === 100 ? 'Add More' : 'Continue'}
                </button>
            </div>
        </div>
    );
};

const GettingStartedView: React.FC<GettingStartedViewProps> = ({ setCurrentView }) => {
    const { properties, tenants, units } = useData();
    const [stats, setStats] = useState({
        propertyProgress: 0,
        unitProgress: 0,
        tenantProgress: 0,
        totalProgress: 0
    });

    useEffect(() => {
        const hasProperties = properties.length > 0;
        const hasUnits = units.length > 0;
        const hasTenants = tenants.length > 0;

        const pProg = hasProperties ? 100 : 0;
        const uProg = hasUnits ? 100 : 0;
        const tProg = hasTenants ? 100 : 0;

        setStats({
            propertyProgress: pProg,
            unitProgress: uProg,
            tenantProgress: tProg,
            totalProgress: Math.round((pProg + uProg + tProg) / 3)
        });
    }, [properties, units, tenants]);

    return (
        <div className="animate-fadeIn max-w-5xl mx-auto pb-10">
            <h2 className="text-2xl font-medium text-gray-700 mb-6">Getting Started</h2>
            
            <div className="bg-white border-b border-gray-200 pb-8 mb-6">
                <p className="text-gray-500 text-sm mb-4">Take a few minutes to set up your account.</p>
                <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                    <div 
                        className="bg-[#1a237e] h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2" 
                        style={{ width: `${stats.totalProgress}%` }}
                    >
                        {stats.totalProgress > 10 && <span className="text-white text-xs font-bold">{stats.totalProgress}%</span>}
                    </div>
                </div>
                {stats.totalProgress === 0 && <p className="text-sm text-gray-500">0% completed</p>}
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <Step 
                    title="Add Property" 
                    description="Add your property name and location to start managing." 
                    italicSuffix={`(Total Properties: ${properties.length})`}
                    completedPercentage={stats.propertyProgress}
                    onContinue={() => setCurrentView && setCurrentView('PropertyForm')}
                />
                <Step 
                    title="Add Units" 
                    description="Add units to your property." 
                    italicSuffix={units.length > 0 ? `(Total Units: ${units.length})` : "(Add a property first)"}
                    completedPercentage={stats.unitProgress}
                    onContinue={() => setCurrentView && setCurrentView('UnitForm')}
                />
                <Step 
                    title="Add Tenants" 
                    description="Add tenants to the units you created." 
                    italicSuffix={tenants.length > 0 ? `(Total Tenants: ${tenants.length})` : ""}
                    completedPercentage={stats.tenantProgress}
                    onContinue={() => setCurrentView && setCurrentView('TenantForm')}
                />
                
                <div className="flex justify-end mt-6 pt-4">
                    <button 
                        onClick={() => setCurrentView && setCurrentView('Dashboard')}
                        className="text-[#1a237e] text-sm font-medium hover:underline flex items-center"
                    >
                        Skip Onboarding <span className="ml-1">&gt;</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GettingStartedView;
