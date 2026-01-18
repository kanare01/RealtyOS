
import React, { useState, useEffect } from 'react';
import { View, Unit } from '../../types';
import { useData } from '../../contexts/DataContext';

interface UnitFormViewProps {
    setCurrentView: (view: View) => void;
}

// Helper component moved outside
const FormRow = ({ label, subLabel, children, helpIcon = false }: { label: string, subLabel?: string, children?: React.ReactNode, helpIcon?: boolean }) => (
    <div className="flex flex-col md:flex-row md:items-start mb-6">
        <div className="w-full md:w-1/3 text-left md:text-right pr-6 mb-2 md:mb-0 pt-2.5">
            <label className="text-gray-700 text-sm font-normal flex items-center justify-end">
                {label}
                {helpIcon && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                )}
            </label>
        </div>
        <div className="w-full md:w-2/3">
            {children}
            {subLabel && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{subLabel}</p>}
        </div>
    </div>
);

const UnitFormView: React.FC<UnitFormViewProps> = ({ setCurrentView }) => {
    const { properties, addUnit, addUnits, editingUnit, updateUnit, setEditingUnit, addNotification } = useData();
    
    // Form Fields
    const [selectedProperty, setSelectedProperty] = useState('');
    const [isBulkMode, setIsBulkMode] = useState(false);
    
    // Single Mode Field
    const [unitId, setUnitId] = useState('');
    
    // Bulk Mode Fields
    const [prefix, setPrefix] = useState('');
    const [startNumber, setStartNumber] = useState('');
    const [endNumber, setEndNumber] = useState('');

    const [category, setCategory] = useState('');
    const [rentAmount, setRentAmount] = useState('');
    const [taxRate, setTaxRate] = useState('');
    
    // Recurring Bills State
    const [billType, setBillType] = useState('');
    const [billAmount, setBillAmount] = useState('');
    
    const [notes, setNotes] = useState('');
    
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Initialize selected property and pre-fill if editing
    useEffect(() => {
        if (editingUnit) {
            setSelectedProperty(editingUnit.propertyName);
            setUnitId(editingUnit.name);
            setCategory(editingUnit.category || '');
            setRentAmount(editingUnit.rentAmount.toString());
            setTaxRate(editingUnit.taxRate?.toString() || '');
            setNotes(editingUnit.notes || '');
            
            if (editingUnit.recurringBills && editingUnit.recurringBills.length > 0) {
                setBillType(editingUnit.recurringBills[0].type);
                setBillAmount(editingUnit.recurringBills[0].amount.toString());
            }
            setIsBulkMode(false); // Can't bulk edit in this form structure yet
        } else if (properties.length > 0 && !selectedProperty) {
            setSelectedProperty(properties[0].name);
        }
    }, [properties, editingUnit]);

    const handleClear = () => {
        setUnitId('');
        setPrefix('');
        setStartNumber('');
        setEndNumber('');
        setCategory('');
        setRentAmount('');
        setTaxRate('');
        setBillType('');
        setBillAmount('');
        setNotes('');
        setEditingUnit(null);
        if (properties.length > 0) {
            setSelectedProperty(properties[0].name);
        }
        setIsSubmitted(false);
    };

    const handleSave = () => {
        if (!selectedProperty) {
            addNotification("Please select a property", 'error');
            return;
        }

        const propObj = properties.find(p => p.name === selectedProperty);
        const recurringBills = billType ? [{ type: billType, amount: parseFloat(billAmount) || 0 }] : [];
        const baseRent = parseInt(rentAmount) || 0;

        // --- Editing Logic ---
        if (editingUnit) {
             updateUnit({
                ...editingUnit,
                propertyId: propObj?.id || editingUnit.propertyId,
                propertyName: selectedProperty,
                name: unitId,
                rentAmount: baseRent,
                category,
                taxRate: parseFloat(taxRate) || 0,
                notes,
                recurringBills
            });
            addNotification('Unit updated successfully', 'success');
            setEditingUnit(null);
            setCurrentView('Units');
            return;
        }

        // --- Creation Logic ---
        if (isBulkMode) {
            if (!startNumber || !endNumber) {
                addNotification("Please enter Starting Number and Ending Number", 'error');
                return;
            }

            const start = parseInt(startNumber);
            const end = parseInt(endNumber);

            if (isNaN(start) || isNaN(end)) {
                addNotification("Starting and Ending numbers must be valid integers", 'error');
                return;
            }

            if (start > end) {
                addNotification("Starting Number cannot be greater than Ending Number", 'error');
                return;
            }

            const count = end - start + 1;
            if (count > 500) {
                if (!confirm(`You are about to create ${count} units. This might take a moment. Continue?`)) return;
            }

            const unitsToAdd: Unit[] = [];
            for (let i = start; i <= end; i++) {
                const name = `${prefix}${i}`;
                unitsToAdd.push({
                    id: Date.now() + i, // Unique ID generation strategy
                    propertyId: propObj?.id || 0,
                    propertyName: selectedProperty,
                    name: name,
                    rentAmount: baseRent,
                    status: 'Vacant',
                    type: 'Residential', 
                    category,
                    taxRate: parseFloat(taxRate) || 0,
                    notes,
                    recurringBills
                });
            }
            addUnits(unitsToAdd);
            addNotification(`${count} units created successfully`, 'success');

        } else {
            // Single Create
            if (!unitId || !rentAmount) {
                addNotification("Please fill in the required fields (Property, Unit ID, Rent Amount)", 'error');
                return;
            }

            addUnit({
                id: Date.now(),
                propertyId: propObj?.id || 0,
                propertyName: selectedProperty,
                name: unitId,
                rentAmount: baseRent,
                status: 'Vacant',
                type: 'Residential', 
                category,
                taxRate: parseFloat(taxRate) || 0,
                notes,
                recurringBills
            });
            addNotification('Unit added successfully', 'success');
        }

        setIsSubmitted(true);
    };

    const handleAddAnother = () => {
        setUnitId('');
        setPrefix('');
        setStartNumber('');
        setEndNumber('');
        // Keep rent/property/category selected for ease of entry
        setIsSubmitted(false);
    };

    const handleNavigateToTenant = () => {
        if (isBulkMode) {
            setCurrentView('BulkTenantForm');
        } else {
            setCurrentView('TenantForm');
        }
    };

    const handleBack = () => {
        setEditingUnit(null);
        setCurrentView('Units');
    };

    return (
        <div className="animate-fadeIn w-full max-w-5xl mx-auto pb-20 relative px-4 md:px-0">
            <div className="mb-4">
                <button 
                    onClick={handleBack}
                    className="flex items-center text-[#1a237e] border border-[#1a237e] px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors bg-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Units
                </button>
            </div>

            <h2 className="text-2xl font-normal text-gray-700 mb-6">{editingUnit ? 'Edit Unit' : 'Unit Form'}</h2>

            <div className="max-w-4xl mx-auto">
                <FormRow label="Select Property">
                    <select 
                        value={selectedProperty}
                        onChange={(e) => setSelectedProperty(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                    >
                        {properties.length === 0 && <option value="">No properties available</option>}
                        {properties.map(prop => (
                            <option key={prop.id} value={prop.name}>{prop.name}</option>
                        ))}
                    </select>
                </FormRow>

                {!editingUnit && (
                    <FormRow label="Add Mode">
                        <div className="flex items-center space-x-4 pt-2">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={!isBulkMode} 
                                    onChange={() => setIsBulkMode(false)}
                                    className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Add Unit</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={isBulkMode} 
                                    onChange={() => setIsBulkMode(true)}
                                    className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Add Multiple Units</span>
                            </label>
                        </div>
                    </FormRow>
                )}

                {isBulkMode ? (
                    <>
                        <FormRow 
                            label="Prefix (optional)" 
                            subLabel="e.g. 'A', 'Block B - '"
                        >
                            <input 
                                type="text"
                                placeholder="Prefix ..."
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>
                        <FormRow label="Starting Number">
                            <input 
                                type="number" 
                                placeholder="e.g. 1"
                                value={startNumber}
                                onChange={(e) => setStartNumber(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>
                        <FormRow label="Ending Number">
                            <input 
                                type="number" 
                                placeholder="e.g. 10"
                                value={endNumber}
                                onChange={(e) => setEndNumber(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>
                    </>
                ) : (
                    <FormRow label="Unit ID/Name">
                        <input 
                            type="text" 
                            placeholder="Unit ID/Name ..."
                            value={unitId}
                            onChange={(e) => setUnitId(e.target.value)}
                            className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                        />
                    </FormRow>
                )}

                <FormRow label="Unit Category">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                    >
                        <option value="">Select Category</option>
                        <option value="Bedsitter">Bedsitter</option>
                        <option value="Studio">Studio</option>
                        <option value="1 Bedroom">1 Bedroom</option>
                        <option value="2 Bedroom">2 Bedroom</option>
                        <option value="3 Bedroom">3 Bedroom</option>
                        <option value="4 Bedroom">4 Bedroom</option>
                        <option value="5+ Bedroom">5+ Bedroom</option>
                        <option value="Shop">Shop</option>
                        <option value="Office">Office</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Other">Other</option>
                    </select>
                </FormRow>

                <FormRow label={isBulkMode ? "Default Rent Amount" : "Rent Amount"} subLabel={isBulkMode ? "This rent amount will be applied to all units in the range." : undefined}>
                    <input 
                        type="number" 
                        placeholder={isBulkMode ? "default rent amount ..." : "rent amount ..."}
                        value={rentAmount}
                        onChange={(e) => setRentAmount(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                    />
                </FormRow>

                <FormRow 
                    label="Tax Rate % (optional)" 
                    subLabel="Residential units tax rate is usually 7.5%. Commercial units tax rate is usually 16%."
                >
                    <input 
                        type="number" 
                        placeholder="tax rate ..."
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                    />
                </FormRow>

                <FormRow label="Other Recurring Bills (optional)" helpIcon>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Select bill type"
                            value={billType}
                            onChange={(e) => setBillType(e.target.value)}
                            className="flex-1 border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                        />
                        <input 
                            type="number" 
                            placeholder="amount"
                            value={billAmount}
                            onChange={(e) => setBillAmount(e.target.value)}
                            className="flex-1 border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                        />
                        <button className="px-3 py-1 border border-gray-300 rounded-sm bg-white hover:bg-gray-50 text-gray-600 font-bold shadow-sm">
                            <span className="text-lg">+</span>
                        </button>
                    </div>
                </FormRow>

                <FormRow label="Notes (optional)">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="notes ..."
                        rows={3}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border resize-none"
                    />
                </FormRow>

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-8 max-w-4xl mx-auto">
                    {!isSubmitted ? (
                        <>
                            <button 
                                onClick={handleSave}
                                className="w-full bg-[#000080] hover:bg-blue-900 text-white font-medium py-2.5 rounded-sm shadow-sm transition-colors flex justify-center items-center"
                            >
                                {editingUnit ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Update Unit
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-1">+</span> {isBulkMode ? 'Add Units' : 'Add Unit'}
                                    </>
                                )}
                            </button>
                            {!editingUnit && (
                                <button 
                                    onClick={handleClear}
                                    className="w-full bg-white border border-[#1a237e] text-[#1a237e] font-medium py-2.5 rounded-sm shadow-sm hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={handleAddAnother}
                                className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1a237e] font-medium py-2.5 rounded-sm shadow-sm transition-colors flex justify-center items-center"
                            >
                                <span className="mr-1">+</span> {isBulkMode ? 'Add More Units' : 'Add Another Unit'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Back Button */}
            {isSubmitted && (
                <div className="mt-8 border-t border-gray-300 pt-6">
                    <div className="flex justify-between items-center">
                        <button 
                            onClick={handleBack}
                            className="flex items-center text-[#1a237e] border border-[#1a237e] px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                        
                        <button 
                            onClick={handleNavigateToTenant}
                            className="flex items-center text-[#1a237e] border border-[#1a237e] px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors bg-white"
                        >
                            Add Tenant(s)
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitFormView;
