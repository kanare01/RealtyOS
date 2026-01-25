
import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface DocumentsSettingsViewProps {
    setCurrentView: (view: View) => void;
}

interface DocTemplate {
    id: number;
    name: string;
    description: string;
    content: string; // Simplified content representation
}

interface GeneratedDocument {
    id: number;
    tenantName: string;
    property: string;
    unit: string;
    type: string;
    status: 'Draft' | 'Sent' | 'Signed';
    dateCreated: string;
}

const DocumentsSettingsView: React.FC<DocumentsSettingsViewProps> = ({ setCurrentView }) => {
    const { tenants } = useData();
    const [activeTab, setActiveTab] = useState<'DOCUMENTS' | 'TEMPLATES'>('DOCUMENTS');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'GENERATE_DOC' | 'EDIT_TEMPLATE' | 'NEW_TEMPLATE'>('GENERATE_DOC');

    // Mock Initial State
    const [templates, setTemplates] = useState<DocTemplate[]>([
        { id: 1, name: 'Lease Agreement', description: 'Standard residential lease agreement', content: 'Lease Agreement Content...' },
        { id: 2, name: 'Late Payment Notice', description: 'Notice for overdue rent', content: 'Dear Tenant, your rent is overdue...' },
        { id: 3, name: 'Move-out Checklist', description: 'Items to check before moving out', content: 'Checklist content...' },
    ]);

    const [documents, setDocuments] = useState<GeneratedDocument[]>([
        { id: 101, tenantName: 'John Doe', property: 'Sunset Apts', unit: '101', type: 'Lease Agreement', status: 'Signed', dateCreated: '2025-10-15' }
    ]);

    // Form State
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [templateForm, setTemplateForm] = useState({ name: '', description: '', content: '' });
    const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);

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

    // Handlers
    const handleOpenGenerateModal = () => {
        setModalMode('GENERATE_DOC');
        setSelectedTenantId('');
        setSelectedTemplateId('');
        setShowModal(true);
    };

    const handleOpenNewTemplateModal = () => {
        setModalMode('NEW_TEMPLATE');
        setTemplateForm({ name: '', description: '', content: '' });
        setShowModal(true);
    };

    const handleOpenEditTemplateModal = (template: DocTemplate) => {
        setModalMode('EDIT_TEMPLATE');
        setTemplateForm({ name: template.name, description: template.description, content: template.content });
        setEditingTemplateId(template.id);
        setShowModal(true);
    };

    const handleDeleteTemplate = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    const handleDeleteDocument = (id: number) => {
        if (confirm('Are you sure you want to delete this document?')) {
            setDocuments(documents.filter(d => d.id !== id));
        }
    };

    const handleSave = () => {
        if (modalMode === 'GENERATE_DOC') {
            if (!selectedTenantId || !selectedTemplateId) {
                alert('Please select a tenant and a template.');
                return;
            }
            const tenant = tenants.find(t => t.id.toString() === selectedTenantId);
            const template = templates.find(t => t.id.toString() === selectedTemplateId);
            
            if (tenant && template) {
                const newDoc: GeneratedDocument = {
                    id: Date.now(),
                    tenantName: tenant.name,
                    property: tenant.property,
                    unit: tenant.unit,
                    type: template.name,
                    status: 'Draft',
                    dateCreated: new Date().toISOString().split('T')[0]
                };
                setDocuments([newDoc, ...documents]);
            }
        } else if (modalMode === 'NEW_TEMPLATE') {
            if (!templateForm.name) {
                alert('Template Name is required.');
                return;
            }
            const newTemplate: DocTemplate = {
                id: Date.now(),
                ...templateForm
            };
            setTemplates([...templates, newTemplate]);
        } else if (modalMode === 'EDIT_TEMPLATE' && editingTemplateId) {
             setTemplates(templates.map(t => t.id === editingTemplateId ? { ...t, ...templateForm } : t));
        }

        setShowModal(false);
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
            
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800">
                                {modalMode === 'GENERATE_DOC' ? 'Generate New Document' : 
                                 modalMode === 'NEW_TEMPLATE' ? 'Create Template' : 'Edit Template'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {modalMode === 'GENERATE_DOC' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
                                        <select 
                                            value={selectedTenantId}
                                            onChange={(e) => setSelectedTenantId(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                        >
                                            <option value="">Select a tenant...</option>
                                            {tenants.map(t => (
                                                <option key={t.id} value={t.id}>{t.name} - {t.property} ({t.unit})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Template</label>
                                        <select 
                                            value={selectedTemplateId}
                                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                        >
                                            <option value="">Select a template...</option>
                                            {templates.map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                                        <input 
                                            type="text" 
                                            value={templateForm.name}
                                            onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                            placeholder="e.g. Lease Agreement"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <input 
                                            type="text" 
                                            value={templateForm.description}
                                            onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                            placeholder="Short description..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                        <textarea 
                                            value={templateForm.content}
                                            onChange={(e) => setTemplateForm({...templateForm, content: e.target.value})}
                                            rows={6}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border resize-none"
                                            placeholder="Document content here..."
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-4 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 text-sm font-medium transition-colors shadow-sm"
                            >
                                {modalMode === 'GENERATE_DOC' ? 'Generate' : 'Save Template'}
                            </button>
                        </div>
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
                                    item.view === 'Documents (beta)'
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
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-medium text-gray-700">Documents (beta)</h2>
                        <button 
                            onClick={activeTab === 'DOCUMENTS' ? handleOpenGenerateModal : handleOpenNewTemplateModal}
                            className="bg-[#000080] hover:bg-blue-900 text-white text-sm font-medium py-2 px-4 rounded shadow-sm transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {activeTab === 'DOCUMENTS' ? 'Generate Document' : 'Create Template'}
                        </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[400px]">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 px-6">
                            <button
                                onClick={() => setActiveTab('DOCUMENTS')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'DOCUMENTS'
                                        ? 'border-[#1a237e] text-[#1a237e]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                DOCUMENTS
                            </button>
                            <button
                                onClick={() => setActiveTab('TEMPLATES')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'TEMPLATES'
                                        ? 'border-[#1a237e] text-[#1a237e]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                TEMPLATES
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'DOCUMENTS' ? (
                                <div>
                                    <p className="text-sm text-gray-800 mb-6">
                                        Use this page to view and manage documents generated for your tenants.
                                    </p>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm text-left">
                                            <thead className="text-gray-400 font-medium border-b border-gray-100">
                                                <tr>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Member Name</th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Property - Unit</th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Document Type</th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Status</th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Date Created</th>
                                                    <th className="py-3 font-normal text-xs uppercase tracking-wide">Options</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                {documents.map(doc => (
                                                    <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className="py-4 pr-4 font-medium text-[#1a237e]">{doc.tenantName}</td>
                                                        <td className="py-4 pr-4">{doc.property} - {doc.unit}</td>
                                                        <td className="py-4 pr-4">{doc.type}</td>
                                                        <td className="py-4 pr-4">
                                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                                doc.status === 'Signed' ? 'bg-green-100 text-green-800' :
                                                                doc.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {doc.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 pr-4">{doc.dateCreated}</td>
                                                        <td className="py-4">
                                                            <div className="flex space-x-2">
                                                                <button className="text-blue-600 hover:text-blue-800 text-xs">View</button>
                                                                <button 
                                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                                    className="text-red-600 hover:text-red-800 text-xs"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {documents.length === 0 && (
                                                    <tr>
                                                        <td colSpan={6} className="py-8 text-center text-gray-500">
                                                            No documents generated yet. Click "Generate Document" to start.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <div className="pt-4 text-xs text-gray-400">
                                            Showing {documents.length} records
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-800 mb-6">
                                        Customize templates used to create tenant documents.
                                    </p>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm text-left">
                                            <thead className="text-gray-400 font-medium border-b border-gray-100">
                                                <tr>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Template</th>
                                                    <th className="py-3 pr-4 font-normal text-xs uppercase tracking-wide">Description</th>
                                                    <th className="py-3 font-normal text-xs uppercase tracking-wide">Options</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                {templates.map(template => (
                                                    <tr key={template.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className="py-4 pr-4 font-bold text-gray-600">{template.name}</td>
                                                        <td className="py-4 pr-4 text-gray-500">{template.description}</td>
                                                        <td className="py-4">
                                                            <div className="flex space-x-2">
                                                                <button 
                                                                    onClick={() => handleOpenEditTemplateModal(template)}
                                                                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteTemplate(template.id)}
                                                                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {templates.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3} className="py-8 text-center text-gray-500">
                                                            No templates found. Click "Create Template" to add one.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentsSettingsView;
