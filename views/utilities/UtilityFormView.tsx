
import React, { useState, useEffect, useMemo } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface UtilityFormViewProps {
    setCurrentView: (view: View) => void;
}

const UtilityFormView: React.FC<UtilityFormViewProps> = ({ setCurrentView }) => {
    const { properties, getUnitsByProperty, addUtility } = useData();
    
    const [property, setProperty] = useState('');
    const [unit, setUnit] = useState('');
    const [type, setType] = useState('Water');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [prevReading, setPrevReading] = useState('');
    const [currReading, setCurrReading] = useState('');
    const [rate, setRate] = useState('');
    const [fixedAmount, setFixedAmount] = useState('');
    const [isFixedCost, setIsFixedCost] = useState(false);

    useEffect(() => {
        if (properties.length > 0 && !property) {
            setProperty(properties[0].name);
        }
    }, [properties]);

    const availableUnits = useMemo(() => {
        return getUnitsByProperty(property);
    }, [property, getUnitsByProperty]);

    // Auto-populate rate based on property settings
    useEffect(() => {
        const prop = properties.find(p => p.name === property);
        if (prop) {
            if (type === 'Water' && prop.waterRate) {
                setRate(prop.waterRate.toString());
            } else if (type === 'Electricity' && prop.electricityRate) {
                setRate(prop.electricityRate.toString());
            } else {
                setRate('');
            }
        }
    }, [property, type, properties]);

    const calculatedConsumption = useMemo(() => {
        const prev = parseFloat(prevReading) || 0;
        const curr = parseFloat(currReading) || 0;
        return Math.max(0, curr - prev);
    }, [prevReading, currReading]);

    const calculatedCost = useMemo(() => {
        if (isFixedCost) return parseFloat(fixedAmount) || 0;
        const r = parseFloat(rate) || 0;
        return calculatedConsumption * r;
    }, [isFixedCost, fixedAmount, calculatedConsumption, rate]);

    const handleSubmit = () => {
        if (!property || !unit || !date) {
            alert("Please fill in Property, Unit, and Date.");
            return;
        }

        if (!isFixedCost && (!prevReading || !currReading || !rate)) {
             alert("Please fill in readings and rate.");
             return;
        }

        if (isFixedCost && !fixedAmount) {
            alert("Please enter amount.");
            return;
        }

        addUtility({
            id: Date.now(),
            date,
            propertyName: property,
            unitName: unit,
            type,
            previousReading: isFixedCost ? 0 : parseFloat(prevReading),
            currentReading: isFixedCost ? 0 : parseFloat(currReading),
            consumption: isFixedCost ? 0 : calculatedConsumption,
            rate: isFixedCost ? 0 : parseFloat(rate),
            amount: calculatedCost,
            status: 'Uninvoiced'
        });

        alert("Utility recorded successfully!");
        setCurrentView('Utilities');
    };

    return (
        <div className="animate-fadeIn w-full max-w-4xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Utilities')}
                    className="flex items-center text-[#1a237e] text-sm hover:underline mb-4"
                >
                    &larr; Back to Utilities
                </button>
                <h2 className="text-2xl font-normal text-gray-700">Record Utility</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="">Select Unit</option>
                            {availableUnits.map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Utility Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="Water">Water</option>
                            <option value="Electricity">Electricity</option>
                            <option value="Garbage">Garbage</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="mb-6 flex items-center">
                    <input 
                        type="checkbox" 
                        id="fixedCost"
                        checked={isFixedCost}
                        onChange={(e) => setIsFixedCost(e.target.checked)}
                        className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded mr-2"
                    />
                    <label htmlFor="fixedCost" className="text-sm text-gray-700">Flat Rate / Fixed Amount (No readings)</label>
                </div>

                {!isFixedCost ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Previous Reading</label>
                            <input
                                type="number"
                                value={prevReading}
                                onChange={(e) => setPrevReading(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Reading</label>
                            <input
                                type="number"
                                value={currReading}
                                onChange={(e) => setCurrReading(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rate (per unit)</label>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            value={fixedAmount}
                            onChange={(e) => setFixedAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border max-w-xs"
                        />
                    </div>
                )}

                <div className="bg-gray-50 p-4 rounded-md mb-6 flex justify-between items-center border border-gray-200">
                    <div>
                        {!isFixedCost && <p className="text-sm text-gray-500">Consumption: <b>{calculatedConsumption}</b> units</p>}
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Total Cost</p>
                        <p className="text-2xl font-bold text-[#1a237e]">KES {calculatedCost.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setCurrentView('Utilities')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 transition-colors shadow-sm font-medium"
                    >
                        Save Utility
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UtilityFormView;
