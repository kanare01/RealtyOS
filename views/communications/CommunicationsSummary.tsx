
import React from 'react';
import { Message } from '../../types';

interface CommunicationsSummaryProps {
    messages: Message[];
}

const CommunicationsSummary: React.FC<CommunicationsSummaryProps> = ({ messages }) => {
    const totalSMS = messages.filter(m => m.type === 'SMS').length;
    const totalEmail = messages.filter(m => m.type === 'Email').length;
    
    // Just a basic cost estimation for demo purposes
    const estimatedCost = totalSMS * 1; // 1 KES per SMS

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Summary</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-8 flex justify-center items-center gap-8">
                 <div className="text-center relative">
                    <div className="flex items-center justify-center mb-2">
                        <span className="w-8 h-[1px] bg-gray-200 mr-2"></span>
                        <p className="text-gray-500 text-sm">Total SMS</p>
                        <span className="w-8 h-[1px] bg-gray-200 ml-2"></span>
                    </div>
                    <div className="text-[#1a237e] text-3xl font-medium mb-1">{totalSMS}</div>
                    <p className="text-gray-400 text-xs">(sent)</p>
                </div>

                <div className="text-center relative">
                    <div className="flex items-center justify-center mb-2">
                        <span className="w-8 h-[1px] bg-gray-200 mr-2"></span>
                        <p className="text-gray-500 text-sm">Total Emails</p>
                        <span className="w-8 h-[1px] bg-gray-200 ml-2"></span>
                    </div>
                    <div className="text-[#1a237e] text-3xl font-medium mb-1">{totalEmail}</div>
                    <p className="text-gray-400 text-xs">(sent)</p>
                </div>

                <div className="text-center relative hidden md:block">
                    <div className="flex items-center justify-center mb-2">
                        <span className="w-8 h-[1px] bg-gray-200 mr-2"></span>
                        <p className="text-gray-500 text-sm">Est. Cost</p>
                        <span className="w-8 h-[1px] bg-gray-200 ml-2"></span>
                    </div>
                    <div className="text-gray-700 text-3xl font-medium mb-1">{estimatedCost}</div>
                    <p className="text-gray-400 text-xs">KES</p>
                </div>
            </div>
        </div>
    );
};

export default CommunicationsSummary;
