
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

const initialTemplates: Template[] = [
    {
        id: 1,
        name: 'Comprehensive Reminder',
        type: 'email',
        description: 'Used to send comprehensive balance reminders that includes previous and current month balances breakdown.',
        content: 'Dear [TENANT_NAME], Previous balance: [PREVIOUS_BALANCE], [CURRENT_MONTH] balance: [CURRENT_BALANCE]. Total due is KES [TOTAL_BALANCE]. [PAYMENT_INSTRUCTIONS]. [SIGNATURE]'
    },
    {
        id: 2,
        name: 'Simple SMS Reminder',
        type: 'sms',
        description: 'A short reminder for SMS notifications.',
        content: 'Hi [TENANT_NAME], your total due is KES [TOTAL_BALANCE]. Please pay by [DUE_DATE]. [PAYMENT_INSTRUCTIONS].'
    },
    {
        id: 3,
        name: 'Invoice Notification',
        type: 'email',
        description: 'Sent when a new invoice is generated.',
        content: 'Hello [TENANT_NAME], a new invoice #[INVOICE_NUMBER] for KES [INVOICE_AMOUNT] has been generated. Total due: KES [TOTAL_BALANCE].'
    },
    {
        id: 4,
        name: 'Payment Acknowledgement',
        type: 'sms',
        description: 'Sent after receiving payment.',
        content: 'Received KES [AMOUNT_PAID] from [TENANT_NAME]. New Balance: KES [TOTAL_BALANCE]. Thank you.'
    }
];

const availablePlaceholders = [
    '[TENANT_NAME]', '[TOTAL_BALANCE]', '[PREVIOUS_BALANCE]', '[CURRENT_BALANCE]', 
    '[CURRENT_MONTH]', '[PAYMENT_INSTRUCTIONS]', '[SIGNATURE]', '[DUE_DATE]', 
    '[INVOICE_NUMBER]', '[INVOICE_AMOUNT]', '[AMOUNT_PAID]'
];

const TemplateCard: React.FC<{ 
    template: Template; 
    onUpdate: (updatedTemplate: Template) => void;
}> = ({ template, onUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Template>(template);

    const handleSave = (e: React.FormEvent) => {
        e.stopPropagation();
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData(template);
        setIsEditing(false);
    };

    const toggleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(!isEditing);
        if (!isExpanded) setIsExpanded(true);
    };

    return (
        <div className={`bg-white border rounded-lg mb-4 transition-all duration-200 ${isExpanded ? 'border-[#1a237e] shadow-md' : 'border-gray-200 hover:shadow-sm'}`}>
            {/* Header */}
            <div 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 cursor-pointer select-none"
                onClick={() => !isEditing && setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3 mb-2 md:mb-0 w-full md:w-1/3">
                    <span className="font-medium text-gray-700 text-sm">{template.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${template.type === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {template.type}
                    </span>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>

                {!isExpanded && (
                    <div className="flex-1 text-xs text-gray-500 truncate md:mr-4">
                        {template.content}
                    </div>
                )}

                <div className="flex justify-end md:w-auto">
                    <button 
                        onClick={toggleEdit}
                        className="text-gray-400 hover:text-[#1a237e] p-1"
                        title="Edit Template"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-gray-100 p-6 bg-gray-50/50 rounded-b-lg animate-fadeIn">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Template Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value as 'email'|'sms'})}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white"
                                    >
                                        <option value="email">Email</option>
                                        <option value="sms">SMS</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <input 
                                    type="text" 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
                                <textarea 
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    rows={4}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2"
                                />
                                <p className="text-xs text-gray-500 mt-1 text-right">{formData.content.length} characters</p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button 
                                    onClick={handleCancel}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 text-sm font-medium transition-colors shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200 pb-4">
                                <div>
                                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Type</span>
                                    <span className="text-sm text-gray-700 capitalize">{template.type}</span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</span>
                                    <span className="text-sm text-gray-700">{template.description}</span>
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message Content</span>
                                <div className="bg-white border border-gray-200 rounded p-3 text-sm text-gray-600 font-mono whitespace-pre-wrap leading-relaxed">
                                    {template.content}
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="text-[#1a237e] hover:text-blue-900 text-sm font-medium flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit Template
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const CustomMessageTemplateSettingsView: React.FC<CustomMessageTemplateSettingsViewProps> = ({ setCurrentView }) => {
    const [templates, setTemplates] = useState<Template[]>(initialTemplates);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

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

    const showNotificationMsg = (message: string, type: 'success' | 'info' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleUpdateTemplate = (updatedTemplate: Template) => {
        setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        showNotificationMsg(`'${updatedTemplate.name}' updated successfully.`);
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 right-4 md:right-10 z-50 animate-fadeIn">
                    <div className="bg-green-100 border-green-400 text-green-700 border px-4 py-3 rounded relative shadow-lg" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> {notification.message}</span>
                    </div>
                </div>
            )}

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
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-medium text-gray-700">Custom Message Templates</h2>
                            <p className="text-sm text-gray-500 mt-1">Customize messages (SMS or Email) sent to your tenants.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Templates List */}
                        <div className="lg:col-span-2">
                            {templates.map((template) => (
                                <TemplateCard 
                                    key={template.id} 
                                    template={template} 
                                    onUpdate={handleUpdateTemplate}
                                />
                            ))}
                        </div>

                        {/* Helper Column */}
                        <div className="lg:col-span-1">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 sticky top-6">
                                <h3 className="font-semibold text-[#1a237e] mb-2 text-sm">Available Placeholders</h3>
                                <p className="text-xs text-gray-600 mb-4">
                                    Copy and paste these codes into your message content. They will be replaced with actual data when sending.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {availablePlaceholders.map(ph => (
                                        <span 
                                            key={ph} 
                                            className="bg-white border border-blue-200 text-blue-800 text-[10px] font-mono px-2 py-1 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                                            title="Click to copy (simulated)"
                                            onClick={() => navigator.clipboard.writeText(ph)}
                                        >
                                            {ph}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomMessageTemplateSettingsView;
