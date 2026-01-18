
import React, { useState } from 'react';
import TechStack from './TechStack';
import ArchitectureDiagram from './ArchitectureDiagram';
import ErdDiagram from './ErdDiagram';
import ApiContract from './ApiContract';
import SecurityModel from './SecurityModel';
import FoundationGuideModal from './FoundationGuideModal';

const FoundationView: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Tech Stack');
    const [showGuide, setShowGuide] = useState(true);

    const tabs = [
        'Tech Stack',
        'System Architecture',
        'Database Schema',
        'API Contract',
        'Security Model'
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Tech Stack': return <TechStack />;
            case 'System Architecture': return <ArchitectureDiagram />;
            case 'Database Schema': return <ErdDiagram />;
            case 'API Contract': return <ApiContract />;
            case 'Security Model': return <SecurityModel />;
            default: return <TechStack />;
        }
    };

    return (
        <div className="animate-fadeIn relative min-h-full pb-20">
            {showGuide && <FoundationGuideModal onClose={() => setShowGuide(false)} />}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-medium text-gray-700">Platform Foundation</h2>
                    <p className="text-sm text-gray-500 mt-1">Technical specifications and architecture documentation.</p>
                </div>
                <button 
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent("RealtyOS Technical Specification\n\nVersion: 1.0\nGenerated: " + new Date().toISOString() + "\n\nThis document certifies the architectural integrity of the RealtyOS platform.");
                        link.download = "RealtyOS_Tech_Spec.txt";
                        link.click();
                    }}
                    className="mt-4 md:mt-0 bg-white border border-[#1a237e] text-[#1a237e] hover:bg-blue-50 font-medium py-2 px-4 rounded shadow-sm text-sm transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Spec
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[600px]">
                <div className="border-b border-gray-200 overflow-x-auto bg-gray-50">
                    <nav className="flex -mb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab
                                        ? 'border-[#1a237e] text-[#1a237e] bg-white'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6 bg-white transition-all duration-300">
                    <div className="animate-fadeIn">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoundationView;
