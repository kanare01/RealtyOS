
import React from 'react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 z-50 fixed inset-0">
            <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-[#1a237e] rounded-full opacity-20 animate-ping"></div>
                <div className="relative w-full h-full bg-[#1a237e] rounded-full flex items-center justify-center shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">RealtyOS</h2>
            <div className="w-48 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#1a237e] h-full rounded-full animate-progress"></div>
            </div>
            <style>{`
                @keyframes progress {
                    0% { width: 0%; transform: translateX(-100%); }
                    50% { width: 50%; }
                    100% { width: 100%; transform: translateX(100%); }
                }
                .animate-progress {
                    animation: progress 1.5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
