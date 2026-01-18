
import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';
import { API_BASE_URL } from '../../config';

interface DocumentsSettingsViewProps {
    setCurrentView: (view: View) => void;
}

interface DocTemplate {
    id: number;
    name: string;
    description: string;
    content: string;
}

interface GeneratedDocument {
    id: number;
    tenantName: string;
    propertyName: string;
    fileUrl: string;
    category: string;
    uploadDate: string;
    status: 'Draft' | 'Sent' | 'Signed';
}

const DocumentsSettingsView: React.FC<DocumentsSettingsViewProps> = ({ setCurrentView }) => {
    const { tenants, addNotification } = useData();
    const [activeTab, setActiveTab] = useState<'DOCUMENTS' | 'TEMPLATES'>('DOCUMENTS');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'GENERATE_DOC' | 'EDIT_TEMPLATE' | 'NEW_TEMPLATE'>('GENERATE_DOC');

    const [templates, setTemplates] = useState<DocTemplate[]>([
        { id: 1, name: 'Lease Agreement', description: 'Standard residential lease agreement', content: 'Lease Agreement Content...' },
        { id: 2, name: 'Late Payment Notice', description: 'Notice for overdue rent', content: 'Dear Tenant, your rent is overdue...' },
    ]);

    const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [templateForm, setTemplateForm] = useState({ name: '', description: '', content: '' });
    const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/files/documents`, {
                headers: { 'Authorization': token ? `Bearer ${token}` : '' }
            });
            if (res.ok) {
                const data = await res.json();
                setDocuments(data.map((d: any) => ({
                    ...d,
                    status: 'Sent'
                })));
            }
        } catch (e) {
            console.error("Failed to fetch docs", e);
        } finally {
            setIsLoading(false);
        }
    };

    const settingsMenu: { label: string; view: View }[] = [
        { label: 'General', view: 'General' },
        { label: 'Backup', view: 'Backup' },
        { label: 'Alerts', view: 'Alerts' },
        { label: 'Account Info', view: 'Account Info' },
        { label: 'Documents (beta)', view: 'Documents (beta)' },
        { label: 'Custom Message Template', view: 'Custom Message Template' },
        { label: 'Team', view: 'Team' },
        { label: 'Billing', view: 'Billing' },
        { label: 'MPESA Transactions', view: 'MPESA Transactions' },
        { label: 'Audit Trail', view: 'Audit Trail' },
    ];

    const handleGenerateDocument = () => {
        // Mock generation
        if (!selectedTenantId || !selectedTemplateId) {
            addNotification("Please select tenant and template", "error");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            const tenant = tenants.find(t => t.id.toString() === selectedTenantId);
            const template = templates.find(t => t.id.toString() === selectedTemplateId);
            if (tenant && template) {
                const newDoc: GeneratedDocument = {
                    id: Date.now(),
                    tenantName: tenant.name,
                    propertyName: tenant.property,
                    fileUrl: '#',
                    category: template.name,
                    uploadDate: new Date().toISOString().split('T')[0],
                    status: 'Draft'
                };
                setDocuments([newDoc, ...documents]);
                addNotification("Document generated successfully", "success");
                setShowModal(false);
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleSaveTemplate = () => {
        if (!templateForm.name || !templateForm.content) {
            addNotification("Name and content are required", "error");
            return;
        }
        
        if (modalMode === 'NEW_TEMPLATE') {
            const newTemplate: DocTemplate = {
                id: Date.now(),
                ...templateForm
            };
            setTemplates([...templates, newTemplate]);
            addNotification("Template created", "success");
        } else if (modalMode === 'EDIT_TEMPLATE' && editingTemplateId) {
            setTemplates(templates.map(t => t.id === editingTemplateId ? { ...t, ...templateForm } : t));
            addNotification("Template updated", "success");
        }
        setShowModal(false);
    };

    const openGenerateModal = () => {
        setModalMode('GENERATE_DOC');
        setSelectedTenantId('');
        setSelectedTemplateId('');
        setShowModal(true);
    };

    const openNewTemplateModal = () => {
        setModalMode('NEW_TEMPLATE');
        setTemplateForm({ name: '', description: '', content: '' });
        setShowModal(true);
    };

    const openEditTemplateModal = (template: DocTemplate) => {
        setModalMode('EDIT_TEMPLATE');
        setTemplateForm({ name: template.name, description: template.description, content: template.content });
        setEditingTemplateId(template.id);
        setShowModal(true);
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
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
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-medium text-gray-700">Documents</h2>
                        <div className="flex space-x-2">
                            {activeTab === 'DOCUMENTS' ? (
                                <button 
                                    onClick={openGenerateModal}
                                    className="bg-[#1a237e] hover:bg-blue-900 text-white text-sm font-medium py-2 px-4 rounded shadow-sm transition-colors"
                                >
                                    Generate Document
                                </button>
                            ) : (
                                <button 
                                    onClick={openNewTemplateModal}
                                    className="bg-[#1a237e] hover:bg-blue-900 text-white text-sm font-medium py-2 px-4 rounded shadow-sm transition-colors"
                                >
                                    New Template
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`py-2 px-4 text-sm font-medium ${activeTab === 'DOCUMENTS' ? 'text-[#1a237e] border-b-2 border-[#1a237e]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('DOCUMENTS')}
                        >
                            Generated Documents
                        </button>
                        <button
                            className={`py-2 px-4 text-sm font-medium ${activeTab === 'TEMPLATES' ? 'text-[#1a237e] border-b-2 border-[#1a237e]' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('TEMPLATES')}
                        >
                            Templates
                        </button>
                    </div>

                    {activeTab === 'DOCUMENTS' && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Tenant</th>
                                        <th className="px-6 py-3">Property</th>
                                        <th className="px-6 py-3">Document Type</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {documents.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                No documents generated yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        documents.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-gray-800 font-medium">{doc.tenantName}</td>
                                                <td className="px-6 py-4 text-gray-600">{doc.propertyName}</td>
                                                <td className="px-6 py-4 text-gray-600">{doc.category}</td>
                                                <td className="px-6 py-4 text-gray-500">{doc.uploadDate}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${doc.status === 'Sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {doc.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-blue-600 hover:underline">Download</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'TEMPLATES' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {templates.map(tpl => (
                                <div key={tpl.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <h3 className="font-medium text-gray-800 mb-1">{tpl.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{tpl.description}</p>
                                    <div className="flex justify-end space-x-2">
                                        <button 
                                            onClick={() => openEditTemplateModal(tpl)}
                                            className="text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800">
                                {modalMode === 'GENERATE_DOC' ? 'Generate Document' : modalMode === 'NEW_TEMPLATE' ? 'New Template' : 'Edit Template'}
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
                                            <option value="">Select Tenant</option>
                                            {tenants.map(t => (
                                                <option key={t.id} value={t.id}>{t.name} ({t.unit})</option>
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
                                            <option value="">Select Template</option>
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
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <input 
                                            type="text" 
                                            value={templateForm.description}
                                            onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                        <textarea 
                                            rows={5}
                                            value={templateForm.content}
                                            onChange={(e) => setTemplateForm({...templateForm, content: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border resize-none"
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
                                onClick={modalMode === 'GENERATE_DOC' ? handleGenerateDocument : handleSaveTemplate}
                                disabled={isLoading}
                                className="px-4 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 text-sm font-medium transition-colors shadow-sm"
                            >
                                {isLoading ? 'Processing...' : modalMode === 'GENERATE_DOC' ? 'Generate' : 'Save Template'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentsSettingsView;
