
import React, { useState, useEffect } from 'react';
import { Property, Tenant } from '../../types';
import { useData } from '../../contexts/DataContext';

interface NewMessageModalProps {
    onClose: () => void;
    properties: Property[];
    tenants: Tenant[];
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ onClose, properties, tenants }) => {
    const { addMessage } = useData();
    
    const [targetType, setTargetType] = useState<'All Tenants' | 'Specific Tenant' | 'Team'>('Specific Tenant');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [messageType, setMessageType] = useState<'SMS' | 'Email'>('SMS');
    const [messageContent, setMessageContent] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Initial property selection
    useEffect(() => {
        if (properties.length > 0 && !selectedProperty) {
            setSelectedProperty(properties[0].name);
        }
    }, [properties, selectedProperty]);

    // Filter tenants based on selected property
    const filteredTenants = tenants.filter(t => t.property === selectedProperty);

    const handleSend = () => {
        if (!messageContent.trim()) {
            alert("Message content cannot be empty.");
            return;
        }

        setIsSending(true);

        // Simulate sending delay
        setTimeout(() => {
            if (targetType === 'All Tenants') {
                // Send to all tenants in property
                const msgs = filteredTenants.map(t => ({
                    id: Date.now() + Math.random(),
                    date: new Date().toISOString().split('T')[0],
                    recipient: t.name,
                    recipientGroup: 'Tenant' as const,
                    property: t.property,
                    unit: t.unit,
                    type: messageType,
                    status: 'Sent' as const,
                    content: messageContent
                }));
                // In a real app we'd bulk add, but for now we loop or use addMessages if available
                // Assuming addMessages exists or we iterate
                msgs.forEach(m => addMessage(m));
            } else if (targetType === 'Specific Tenant') {
                const tenant = tenants.find(t => t.id.toString() === selectedTenantId);
                if (tenant) {
                    addMessage({
                        id: Date.now(),
                        date: new Date().toISOString().split('T')[0],
                        recipient: tenant.name,
                        recipientGroup: 'Tenant',
                        property: tenant.property,
                        unit: tenant.unit,
                        type: messageType,
                        status: 'Sent',
                        content: messageContent
                    });
                }
            } else {
                // Team mock
                addMessage({
                    id: Date.now(),
                    date: new Date().toISOString().split('T')[0],
                    recipient: "Team Member",
                    recipientGroup: 'Team',
                    property: selectedProperty,
                    type: messageType,
                    status: 'Sent',
                    content: messageContent
                });
            }

            setIsSending(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-800">New Message</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
                </div>
                
                <div className="p-6 space-y-4">
                    {/* Target Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
                        <div className="flex space-x-2 text-xs mb-3">
                            <button 
                                onClick={() => setTargetType('Specific Tenant')}
                                className={`px-3 py-1.5 rounded-full border transition-colors ${targetType === 'Specific Tenant' ? 'bg-[#1a237e] text-white border-[#1a237e]' : 'bg-white text-gray-600 border-gray-300'}`}
                            >
                                Tenant
                            </button>
                            <button 
                                onClick={() => setTargetType('All Tenants')}
                                className={`px-3 py-1.5 rounded-full border transition-colors ${targetType === 'All Tenants' ? 'bg-[#1a237e] text-white border-[#1a237e]' : 'bg-white text-gray-600 border-gray-300'}`}
                            >
                                All Tenants
                            </button>
                            <button 
                                onClick={() => setTargetType('Team')}
                                className={`px-3 py-1.5 rounded-full border transition-colors ${targetType === 'Team' ? 'bg-[#1a237e] text-white border-[#1a237e]' : 'bg-white text-gray-600 border-gray-300'}`}
                            >
                                Team
                            </button>
                        </div>
                    </div>

                    {/* Property Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                        <select 
                            value={selectedProperty}
                            onChange={(e) => setSelectedProperty(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            {properties.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tenant Selector (if single tenant) */}
                    {targetType === 'Specific Tenant' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
                            <select 
                                value={selectedTenantId}
                                onChange={(e) => setSelectedTenantId(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                            >
                                <option value="">Select a tenant...</option>
                                {filteredTenants.map(t => (
                                    <option key={t.id} value={t.id}>{t.name} (Unit: {t.unit})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Message Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={messageType === 'SMS'}
                                    onChange={() => setMessageType('SMS')}
                                    className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">SMS</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={messageType === 'Email'}
                                    onChange={() => setMessageType('Email')}
                                    className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Email</span>
                            </label>
                        </div>
                    </div>

                    {/* Message Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                            rows={4}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border resize-none"
                            placeholder="Type your message here..."
                        ></textarea>
                        {messageType === 'SMS' && (
                            <p className="text-xs text-gray-500 mt-1 text-right">{messageContent.length} characters</p>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={isSending || (targetType === 'Specific Tenant' && !selectedTenantId)}
                        className={`px-4 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 text-sm font-medium transition-colors shadow-sm flex items-center ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSending ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : (
                            'Send Message'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewMessageModal;
