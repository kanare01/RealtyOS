
import React, { useState } from 'react';

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

export const FilterSection: React.FC<SectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div 
                className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="font-semibold text-[#1a237e] text-lg">{title}</h3>
                <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    {isOpen ? '-' : '+'}
                </button>
            </div>
            {isOpen && <div className="p-6">{children}</div>}
        </div>
    );
};

export const ReportSection: React.FC<SectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div 
                className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-gray-700 font-medium text-lg">{title}</h3>
                <button className="text-gray-500 hover:text-gray-700 font-bold text-xl">
                    {isOpen ? '-' : '+'}
                </button>
            </div>
            {isOpen && (
                <div className="p-12 flex justify-center items-center text-gray-500 text-sm">
                    {children}
                </div>
            )}
        </div>
    );
};

export const FilterActions: React.FC = () => (
    <div className="flex flex-wrap items-center gap-4 mt-6">
        <button className="px-6 py-2 bg-[#5C6BC0] text-white text-sm font-medium rounded shadow-sm hover:bg-[#3949AB] flex items-center">
            Submit
            <span className="ml-2 bg-white text-[#5C6BC0] rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">i</span>
        </button>
        <button className="px-6 py-2 bg-white border border-[#5C6BC0] text-[#5C6BC0] text-sm font-medium rounded shadow-sm hover:bg-gray-50">
            Download PDF
        </button>
        <button className="px-6 py-2 bg-white border border-[#5C6BC0] text-[#5C6BC0] text-sm font-medium rounded shadow-sm hover:bg-gray-50">
            Download Excel
        </button>
    </div>
);
