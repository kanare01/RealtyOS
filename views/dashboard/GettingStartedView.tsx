
import React, { useMemo } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface GettingStartedViewProps {
    setCurrentView?: (view: View) => void;
}

const Step: React.FC<{
    stepNumber: number;
    title: string;
    description: string;
    completedPercentage: number;
    italicSuffix?: string;
    onAction: () => void;
    actionLabel: string;
    isLocked?: boolean;
}> = ({ stepNumber, title, description, completedPercentage, italicSuffix, onAction, actionLabel, isLocked }) => {
    const isComplete = completedPercentage === 100;

    return (
        <div className={`flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-100 last:border-0 gap-4 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isComplete ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-[#1a237e]'}`}>
                    {isComplete ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : stepNumber}
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {description} {italicSuffix && <span className="italic text-gray-400">{italicSuffix}</span>}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-6 pl-14 md:pl-0">
                <div className="flex flex-col items-end min-w-[100px]">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mb-1">
                        <div 
                            className={`h-2 rounded-full transition-all duration-1000 ease-out ${isComplete ? 'bg-green-500' : 'bg-[#1a237e]'}`} 
                            style={{ width: `${completedPercentage}%` }}
                        ></div>
                    </div>
                    <span className={`text-xs font-medium mt-1 ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>
                        {isComplete ? 'Completed' : 'Pending'}
                    </span>
                </div>
                <button 
                    onClick={onAction}
                    className={`px-6 py-2 text-sm font-medium border rounded transition-colors whitespace-nowrap min-w-[140px] ${
                        isComplete 
                        ? 'text-green-700 border-green-200 hover:bg-green-50 bg-white'
                        : 'text-white bg-[#1a237e] hover:bg-blue-900 border-transparent shadow-sm'
                    }`}
                >
                    {isComplete ? 'Add Another' : actionLabel}
                </button>
            </div>
        </div>
    );
};

const GettingStartedView: React.FC<GettingStartedViewProps> = ({ setCurrentView }) => {
    const { properties, tenants, units } = useData();

    // Reactive progress calculation
    const progress = useMemo(() => {
        const hasProperties = properties.length > 0;
        const hasUnits = units.length > 0;
        const hasTenants = tenants.length > 0;

        const pProg = hasProperties ? 100 : 0;
        const uProg = hasUnits ? 100 : 0;
        const tProg = hasTenants ? 100 : 0;

        return {
            propertyProgress: pProg,
            unitProgress: uProg,
            tenantProgress: tProg,
            totalProgress: Math.round((pProg + uProg + tProg) / 3)
        };
    }, [properties, units, tenants]);

    // Helper for navigation
    const handleNav = (view: View) => {
        if (setCurrentView) setCurrentView(view);
    };

    return (
        <div className="animate-fadeIn max-w-5xl mx-auto pb-10">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-medium text-gray-700">Getting Started</h2>
                    <p className="text-sm text-gray-500 mt-1">Complete these 3 steps to set up your account.</p>
                </div>
                {progress.totalProgress > 0 && (
                    <button 
                        onClick={() => handleNav('Dashboard')}
                        className="text-[#1a237e] text-sm font-medium hover:underline flex items-center"
                    >
                        Skip to Dashboard <span className="ml-1">&rarr;</span>
                    </button>
                )}
            </div>
            
            <div className="bg-white border-b border-gray-200 pb-8 mb-6 rounded-t-lg">
                <div className="px-6 pt-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Setup Progress</span>
                        <span className="font-bold text-[#1a237e]">{progress.totalProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-blue-600 to-[#1a237e] h-4 rounded-full transition-all duration-1000 ease-out shadow-inner" 
                            style={{ width: `${progress.totalProgress}%` }}
                        >
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <Step 
                    stepNumber={1}
                    title="Add Property" 
                    description="Register your first building or estate." 
                    italicSuffix={properties.length > 0 ? `(${properties.length} added)` : ""}
                    completedPercentage={progress.propertyProgress}
                    onAction={() => handleNav('PropertyForm')}
                    actionLabel="Create Property"
                />
                
                <Step 
                    stepNumber={2}
                    title="Add Units" 
                    description="Define the rentable units within your property." 
                    italicSuffix={units.length > 0 ? `(${units.length} added)` : ""}
                    completedPercentage={progress.unitProgress}
                    onAction={() => handleNav('UnitForm')}
                    actionLabel="Add Units"
                    isLocked={properties.length === 0}
                />
                
                <Step 
                    stepNumber={3}
                    title="Add Tenants" 
                    description="Onboard tenants and assign them to units." 
                    italicSuffix={tenants.length > 0 ? `(${tenants.length} active)` : ""}
                    completedPercentage={progress.tenantProgress}
                    onAction={() => handleNav('TenantForm')}
                    actionLabel="Add Tenant"
                    isLocked={units.length === 0}
                />
            </div>
            
            {progress.totalProgress === 100 && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center animate-fadeIn">
                    <h3 className="text-green-800 font-bold text-lg mb-2">🎉 You're all set!</h3>
                    <p className="text-green-700 mb-4">You have successfully configured the basics of RealtyOS.</p>
                    <button 
                        onClick={() => handleNav('Dashboard')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded shadow-sm transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default GettingStartedView;
