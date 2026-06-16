import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface MaintenanceFormViewProps {
    setCurrentView: (view: View) => void;
}

const MaintenanceFormView: React.FC<MaintenanceFormViewProps> = ({ setCurrentView }) => {
    const { properties, getUnitsByProperty, addMaintenance } = useData();
    
    const [property, setProperty] = useState('');
    const [unit, setUnit] = useState('');
    const [category, setCategory] = useState('Plumbing');
    const [priority, setPriority] = useState('Medium');
    const [description, setDescription] = useState('');
    const [reportedBy, setReportedBy] = useState('');
    const [status, setStatus] = useState('Pending');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!property || !unit || !description) {
            alert('Please fill in all required fields');
            return;
        }

        await addMaintenance({
            id: 0, // Backend will assign ID
            property,
            unit,
            category,
            priority,
            description,
            status,
            reportedBy,
            date: new Date().toISOString().split('T')[0]
        });

        setCurrentView('Maintenance');
    };

    return (
        <div className="animate-fadeIn max-w-2xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Maintenance')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Maintenance
                </button>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-8">New Maintenance Request</h2>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                        <select 
                            value={property}
                            onChange={(e) => setProperty(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                            required
                        >
                            <option value="">Select Property</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
                        <select 
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                            required
                            disabled={!property}
                        >
                            <option value="">Select Unit</option>
                            {getUnitsByProperty(property).map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                        >
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Carpentry">Carpentry</option>
                            <option value="Painting">Painting</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select 
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the issue..."
                        rows={4}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border resize-none"
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                    <input 
                        type="text" 
                        value={reportedBy}
                        onChange={(e) => setReportedBy(e.target.value)}
                        placeholder="Tenant name or staff member"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2.5 px-8 rounded-lg text-sm transition-colors shadow-sm"
                    >
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MaintenanceFormView;
