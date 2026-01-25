
import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PropertyGroupingFormViewProps {
    setCurrentView: (view: View) => void;
}

const PropertyGroupingFormView: React.FC<PropertyGroupingFormViewProps> = ({ setCurrentView }) => {
    const { properties, addPropertyGrouping, updatePropertyGrouping, editingPropertyGrouping } = useData();
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [managerName, setManagerName] = useState('');
    const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);

    useEffect(() => {
        if (editingPropertyGrouping) {
            setName(editingPropertyGrouping.name);
            setDescription(editingPropertyGrouping.description);
            setManagerName(editingPropertyGrouping.managerName);
            setSelectedPropertyIds(editingPropertyGrouping.propertyIds);
        }
    }, [editingPropertyGrouping]);

    const handleToggleProperty = (id: number) => {
        if (selectedPropertyIds.includes(id)) {
            setSelectedPropertyIds(selectedPropertyIds.filter(pid => pid !== id));
        } else {
            setSelectedPropertyIds([...selectedPropertyIds, id]);
        }
    };

    const handleSubmit = () => {
        if (!name) {
            alert("Please provide a grouping name.");
            return;
        }

        const groupData = {
            id: editingPropertyGrouping ? editingPropertyGrouping.id : Date.now(),
            name,
            description,
            managerName,
            propertyIds: selectedPropertyIds
        };

        if (editingPropertyGrouping) {
            updatePropertyGrouping(groupData);
            alert("Property Grouping updated successfully!");
        } else {
            addPropertyGrouping(groupData);
            alert("Property Grouping created successfully!");
        }
        
        setCurrentView('Property Grouping');
    };

    return (
        <div className="animate-fadeIn w-full max-w-4xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Property Grouping')}
                    className="flex items-center text-[#1a237e] text-sm hover:underline mb-4"
                >
                    &larr; Back to Groupings
                </button>
                <h2 className="text-2xl font-normal text-gray-700">
                    {editingPropertyGrouping ? 'Edit Property Grouping' : 'New Property Grouping'}
                </h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grouping Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Nairobi Region Properties"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border resize-none"
                        placeholder="Description of this group..."
                    ></textarea>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manager Name</label>
                    <input
                        type="text"
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Properties</label>
                    <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto bg-gray-50">
                        {properties.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500 text-center">No properties available. Add properties first.</div>
                        ) : (
                            properties.map(prop => (
                                <label key={prop.id} className="flex items-center p-3 hover:bg-gray-100 border-b border-gray-100 last:border-0 cursor-pointer">
                                    <input 
                                        type="checkbox"
                                        checked={selectedPropertyIds.includes(prop.id)}
                                        onChange={() => handleToggleProperty(prop.id)}
                                        className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded mr-3"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">{prop.name}</div>
                                        <div className="text-xs text-gray-500">{prop.address}</div>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {selectedPropertyIds.length} properties selected.
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setCurrentView('Property Grouping')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 transition-colors shadow-sm font-medium"
                    >
                        {editingPropertyGrouping ? 'Update Grouping' : 'Create Grouping'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyGroupingFormView;
