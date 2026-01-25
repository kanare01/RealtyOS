
import React, { useState } from 'react';
import { View } from '../../types';

interface CustomMessageTemplateSettingsViewProps {
    setCurrentView: (view: View) => void;
}

interface Template {
    id: number;
    name: string;
    type: 'email' | 'sms';
    description: string;
    content: string;
}

const mockTemplates: Template[] = [
    {
        id: 1,
        name: 'comprehensive reminder',
        type: 'email',
        description: 'This template is used to send comprehensive balance reminders that includes previous and current month balances breakdown',
        content: 'Previous balance:[PREVIOUS MONTH BALANCE], [CURRENT MONTH] balance: [CURRENT MONTH BALANCE]. Total due is KES [TOTAL BALANCE]. [PAYMENT INSTRUCTION]. [SIGNATURE]'
    },
    {
        id: 2,
        name: 'comprehensive reminder',
        type: 'sms',
        description: 'This template is used to send comprehensive balance reminders that includes previous and current month balances breakdown',
        content: 'Previous balance:[PREVIOUS MONTH BALANCE], [CURRENT MONTH] balance: [CURRENT MONTH BALANCE]. Total due is KES [TOTAL BALANCE]. [PAYMENT INSTRUCTION]. [SIGNATURE]'
    },
    {
        id: 3,
        name: 'invoice reminder',
        type: 'email',
        description: 'This template is used to send invoice reminders',
        content: 'KES [TOTAL BALANCE] is due for [INVOICE ITEMS] and other bills [PAYMENT INSTRUCTION] [SIGNATURE]'
    },
    {
        id: 4,
        name: 'invoice reminder',
        type: 'sms',
        description: 'This template is used to send invoice reminders',
        content: 'KES [TOTAL BALANCE] is due for [INVOICE ITEMS] and other bills [PAYMENT INSTRUCTION] [SIGNATURE]'
    }
];

const TemplateRow: React.FC<{ label: string; value: string; isLast?: boolean }> = ({ label, value, isLast }) => (
    <div className={`flex flex-col md:flex-row md:items-start py-3 px-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
        <div className="w-full md:w-1/4 font-semibold text-gray-500 text-sm mb-1 md:mb-0">
            {label}
        </div>
        <div className="w-full md:w-3/4 text-gray-500 text-sm leading-relaxed">
            {value}
        </div>
    </div>
);

const TemplateCard: React.FC<{ template: Template; defaultExpanded?: boolean }> = ({ template, defaultExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="bg-white border border-gray-200 rounded-sm mb-4 transition-shadow hover:shadow-sm">
            {/* Header (Always Visible) */}
            <div 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3 mb-2 md:mb-0 w-full md:w-1/3">
                    <span className="text-gray-500 text-sm">{template.name}</span>
                    <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                        {template.type}
                    </span>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 text-[#1a237e] transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </div>

                {!isExpanded && (
                    <div className="flex-1 text-xs text-gray-400 truncate md:mr-4">
                        {template.content}
                    </div>
                )}

                <div className="flex justify-end md:w-auto">
                    <button className="text-[#1a237e] hover:text-blue-800 font-bold text-lg leading-none px-2">
                        ...
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="animate-fadeIn">
                    <div className="bg-[#000080] text-center py-2 text-white text-sm font-medium">
                        Edit Custom Template
                    </div>
                    <div className="bg-white border-t border-gray-100">
                        <TemplateRow label="Name" value={template.name} />
                        <TemplateRow label="Type" value={template.type} />
                        <TemplateRow label="Description" value={template.description} />
                        <TemplateRow label="Content" value={template.content} isLast />
                    </div>
                </div>
            )}
        </div>
    );
};

const CustomMessageTemplateSettingsView: React.FC<CustomMessageTemplateSettingsViewProps> = ({ setCurrentView }) => {
    const settingsMenu: { label: string; view: View }[] = [
        { label: 'General', view: 'General' },
        { label: 'Backup', view: 'Backup' },
        { label: 'Alerts', view: 'Alerts' },
        { label: 'Account Info', view: 'Account Info' },
        { label: 'Documents (beta)', view: 'Documents (beta)' },
        { label: 'Custom Message Template', view: 'Custom Message Template' },
        { label: 'Team', view: 'Team' },
        { label: 'Billing', view: 'Billing' },
        { label: 'MPESA Transactions Status', view: 'MPESA Transactions' },
        { label: 'Audit Trail', view: 'Audit Trail' },
    ];

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1">
                        {settingsMenu.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => setCurrentView(item.view)}
                                className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                                    item.view === 'Custom Message Template'
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h2 className="text-2xl font-medium text-gray-700">Custom Message Templates</h2>
                        <p className="text-sm text-gray-800 mt-1">Use this page to customize messages (SMS or Email) sent to Tenants</p>
                    </div>

                    <div className="space-y-0">
                        {mockTemplates.map((template, index) => (
                            <TemplateCard key={template.id} template={template} defaultExpanded={index === 0} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomMessageTemplateSettingsView;
