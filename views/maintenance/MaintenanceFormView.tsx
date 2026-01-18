
import React, { useState, useEffect, useMemo } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface MaintenanceFormViewProps {
    setCurrentView: (view: View) => void;
}

const MaintenanceFormView: React.FC<MaintenanceFormViewProps> = ({ setCurrentView }) => {
    const { properties, getUnitsByProperty, addMaintenanceRequest, updateMaintenanceRequest, editingMaintenanceRequest, addNotification } = useData();
    
    const [property, setProperty] = useState('');
    const [unit, setUnit] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Plumbing');
    const [priority, setPriority] = useState('Medium');
    const [status, setStatus] = useState('Open');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    useEffect(() => {
        if (editingMaintenanceRequest) {
            setProperty(editingMaintenanceRequest.propertyName);
            setUnit(editingMaintenanceRequest.unitName);
            setTitle(editingMaintenanceRequest.title);
            setCategory(editingMaintenanceRequest.category);
            setPriority(editingMaintenanceRequest.priority);
            setStatus(editingMaintenanceRequest.status);
            setDate(editingMaintenanceRequest.date);
            setCost(editingMaintenanceRequest.cost?.toString() || '');
            setDescription(editingMaintenanceRequest.description || '');
            setAssignedTo(editingMaintenanceRequest.assignedTo || '');
        } else if (properties.length > 0 && !property) {
            setProperty(properties[0].name);
        }
    }, [properties, editingMaintenanceRequest]);

    const availableUnits = useMemo(() => {
        return getUnitsByProperty(property);
    }, [property, getUnitsByProperty]);

    const handleSubmit = () => {
        if (!property || !title || !date) {
            addNotification("Please fill in Property, Title, and Date.", 'error');
            return;
        }

        const requestData = {
            id: editingMaintenanceRequest ? editingMaintenanceRequest.id : Date.now(),
            date,
            propertyName: property,
            unitName: unit || 'Common Area',
            title,
            category,
            priority: priority as any,
            status: status as any,
            description,
            cost: parseFloat(cost) || 0,
            assignedTo
        };

        if (editingMaintenanceRequest) {
            updateMaintenanceRequest(requestData);
            addNotification("Maintenance request updated successfully!", 'success');
        } else {
            addMaintenanceRequest(requestData);
            addNotification("Maintenance request created successfully!", 'success');
        }
        
        setCurrentView('Maintenance');
    };

    return (
        <div className="animate-fadeIn w-full max-w-4xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Maintenance')}
                    className="flex items-center text-[#1a237e] text-sm hover:underline mb-4"
                >
                    &larr; Back to Maintenance
                </button>
                <h2 className="text-2xl font-normal text-gray-700">
                    {editingMaintenanceRequest ? 'Edit Maintenance Request' : 'New Maintenance Request'}
                </h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Leaking sink in kitchen"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                        <select
                            value={property}
                            onChange={(e) => setProperty(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            {properties.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit (Optional)</label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="">Common Area / General</option>
                            {availableUnits.map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="HVAC">HVAC</option>
                            <option value="Appliance">Appliance</option>
                            <option value="Carpentry">Carpentry</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Reported</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <div className="flex gap-4">
                            {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                                <label key={p} className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="priority"
                                        checked={priority === p}
                                        onChange={() => setPriority(p)}
                                        className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e]"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">{p}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To (Optional)</label>
                        <input
                            type="text"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            placeholder="e.g. John Doe (Contractor)"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost incurred (KES)</label>
                        <input
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            placeholder="0.00"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border resize-none"
                        placeholder="Detailed description of the issue..."
                    ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setCurrentView('Maintenance')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 transition-colors shadow-sm font-medium"
                    >
                        {editingMaintenanceRequest ? 'Update Request' : 'Create Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceFormView;
