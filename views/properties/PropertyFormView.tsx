
import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PropertyFormViewProps {
    setCurrentView: (view: View) => void;
}

// Helper component moved outside to prevent re-renders losing focus
const FormRow = ({ label, subLabel, children, helpIcon = false }: { label: string, subLabel?: string, children?: React.ReactNode, helpIcon?: boolean }) => (
    <div className="flex flex-col md:flex-row md:items-center mb-6">
        <div className="w-full md:w-1/3 text-left md:text-right pr-6 mb-2 md:mb-0">
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
            {subLabel && <p className="text-xs text-gray-500 mt-1">{subLabel}</p>}
        </div>
    </div>
);

const PropertyFormView: React.FC<PropertyFormViewProps> = ({ setCurrentView }) => {
    const { addProperty } = useData();
    
    // Core Fields
    const [propertyName, setPropertyName] = useState('');
    const [unitCount, setUnitCount] = useState<string>('0');
    const [city, setCity] = useState('');
    
    // UI State
    const [showBanner, setShowBanner] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Advanced Fields
    const [waterRate, setWaterRate] = useState('0');
    const [electricityRate, setElectricityRate] = useState('0');
    const [mpesaType, setMpesaType] = useState<'Paybill' | 'Till'>('Paybill');
    const [paybillNumber, setPaybillNumber] = useState('');
    const [penaltyType, setPenaltyType] = useState('');
    const [taxRate, setTaxRate] = useState('7.5');
    const [managementFeeType, setManagementFeeType] = useState('');
    const [streetName, setStreetName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [notes, setNotes] = useState('');
    const [paymentInstructions, setPaymentInstructions] = useState('');
    const [ownerPhone, setOwnerPhone] = useState('');
    
    // Recurring Bills State (Simple implementation for UI)
    const [billType, setBillType] = useState('');
    const [billAmount, setBillAmount] = useState('');

    const handleClear = () => {
        setPropertyName('');
        setUnitCount('0');
        setCity('');
        setWaterRate('0');
        setElectricityRate('0');
        setMpesaType('Paybill');
        setPaybillNumber('');
        setPenaltyType('');
        setTaxRate('7.5');
        setManagementFeeType('');
        setStreetName('');
        setCompanyName('');
        setNotes('');
        setPaymentInstructions('');
        setOwnerPhone('');
        setBillType('');
        setBillAmount('');
        setIsSubmitted(false);
    };

    const handleAddProperty = () => {
        if (!propertyName) {
            alert("Property Name is required");
            return;
        }

        const recurringBills = billType ? [{ type: billType, amount: parseFloat(billAmount) || 0 }] : [];

        addProperty({
            id: Date.now(),
            name: propertyName,
            address: `${streetName ? streetName + ', ' : ''}${city}` || 'Unknown Location',
            city,
            streetName,
            type: 'Residential', 
            units: parseInt(unitCount) || 0,
            occupancy: 0,
            imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
            waterRate: parseFloat(waterRate) || 0,
            electricityRate: parseFloat(electricityRate) || 0,
            mpesaType,
            paybillNumber,
            penaltyType,
            taxRate: parseFloat(taxRate) || 0,
            managementFeeType,
            companyName,
            notes,
            paymentInstructions,
            ownerPhone,
            recurringBills
        });

        setIsSubmitted(true);
        setShowSuccessModal(true);
        // Auto-dismiss success message but don't navigate
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 3000);
    };

    const handleUpdateProperty = () => {
        // Mock update action
        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 3000);
    }

    return (
        <div className="animate-fadeIn w-full max-w-5xl mx-auto pb-20 relative px-4 md:px-0">
            {showSuccessModal && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md animate-fadeIn">
                    <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
                        <div className="bg-[#DCEDC8] px-6 py-3 flex items-center border-b border-[#C5E1A5]">
                            <svg className="w-5 h-5 text-[#33691E] mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            <h3 className="text-sm font-semibold text-[#33691E]">Success</h3>
                        </div>
                        <div className="p-8 text-center bg-white">
                            <p className="text-[#1B5E20] text-lg font-medium">
                                {isSubmitted ? 'Property Added Successfully' : 'Property Updated Successfully'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-4">
                <button 
                    onClick={() => setCurrentView('Getting Started')}
                    className="flex items-center text-[#1a237e] border border-[#1a237e] px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors bg-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
            </div>

            <h2 className="text-2xl font-normal text-gray-700 mb-6">Property Form</h2>

            {showBanner && (
                <div className="relative bg-white border border-gray-200 border-l-4 border-l-green-500 rounded-sm p-4 mb-8 shadow-sm flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Create a property in order to add units in the next step.</p>
                    <button onClick={() => setShowBanner(false)} className="text-gray-300 hover:text-gray-500 font-bold">×</button>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                {/* Basic Fields */}
                <FormRow label="Property Name">
                    <input 
                        type="text" 
                        placeholder="Property Name ..."
                        value={propertyName}
                        onChange={(e) => setPropertyName(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                    />
                </FormRow>

                <FormRow label="Number of units">
                    <input 
                        type="number" 
                        value={unitCount}
                        onChange={(e) => setUnitCount(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                    />
                </FormRow>

                <FormRow label="City">
                    <input 
                        type="text" 
                        placeholder="City or nearest town ..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                    />
                </FormRow>

                {/* Show More Toggle */}
                <div className="flex flex-col md:flex-row mb-6">
                    <div className="w-full md:w-1/3"></div>
                    <div className="w-full md:w-2/3">
                        <button 
                            onClick={() => setShowMore(!showMore)}
                            className="text-[#1a237e] text-sm font-medium hover:underline flex items-center focus:outline-none"
                        >
                            {showMore ? 'Hide' : 'Show More'}
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${showMore ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Advanced Fields */}
                {showMore && (
                    <div className="animate-fadeIn">
                        <FormRow label="Water rate (optional)" subLabel="(KES per unit consumed)">
                            <input 
                                type="number" 
                                value={waterRate}
                                onChange={(e) => setWaterRate(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>

                        <FormRow label="Electricity rate (optional)" subLabel="(KES per unit consumed)">
                            <input 
                                type="number" 
                                value={electricityRate}
                                onChange={(e) => setElectricityRate(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>

                        <FormRow label="MPESA (optional)">
                            <div className="flex space-x-6">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        checked={mpesaType === 'Paybill'}
                                        onChange={() => setMpesaType('Paybill')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Paybill</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        checked={mpesaType === 'Till'}
                                        onChange={() => setMpesaType('Till')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Till Number</span>
                                </label>
                            </div>
                        </FormRow>

                        <FormRow label={`${mpesaType} Number`} helpIcon>
                            <input 
                                type="text" 
                                value={paybillNumber}
                                onChange={(e) => setPaybillNumber(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>

                        <FormRow label="Rent Payment Penalty (optional)">
                            <select
                                value={penaltyType}
                                onChange={(e) => setPenaltyType(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border text-gray-700"
                            >
                                <option value="">Select Penalty Type</option>
                                <option value="Fixed">Fixed Amount</option>
                                <option value="Percentage">Percentage</option>
                            </select>
                        </FormRow>

                        <FormRow label="Tax Rate % (optional)" subLabel="(Percentage tax rate)">
                            <input 
                                type="number" 
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
                                <button className="px-3 py-1 border border-gray-300 rounded-sm bg-white hover:bg-gray-50 text-gray-600 font-bold">+</button>
                            </div>
                        </FormRow>

                        <FormRow label="Management Fee (optional)" helpIcon>
                            <select
                                value={managementFeeType}
                                onChange={(e) => setManagementFeeType(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border text-gray-700"
                            >
                                <option value="">Select Management Fee Type</option>
                                <option value="Fixed">Fixed</option>
                                <option value="Percentage">Percentage</option>
                            </select>
                        </FormRow>

                        <FormRow label="Street Name (optional)">
                            <input 
                                type="text" 
                                placeholder="Address / Closest street Name ..."
                                value={streetName}
                                onChange={(e) => setStreetName(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>

                        <FormRow label="Company Name (Optional)" helpIcon>
                            <input 
                                type="text" 
                                placeholder="Company Name ..."
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
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

                        <FormRow label="Payment Instructions (optional)" helpIcon>
                            <textarea
                                value={paymentInstructions}
                                onChange={(e) => setPaymentInstructions(e.target.value)}
                                placeholder="payment instructions ..."
                                rows={3}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border resize-none"
                            />
                        </FormRow>

                        <FormRow label="Owner Phone Number (optional)" helpIcon>
                            <div className="flex gap-0">
                                <div className="flex items-center border border-r-0 border-gray-300 rounded-l-sm bg-white px-2 min-w-[80px]">
                                    <span className="mr-1">🇰🇪</span>
                                    <span className="text-sm">+254</span>
                                </div>
                                <input 
                                    type="text" 
                                    value={ownerPhone}
                                    onChange={(e) => setOwnerPhone(e.target.value)}
                                    className="flex-1 border-gray-200 rounded-r-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">The phone number should be in international format: country code then phone number.</p>
                        </FormRow>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-8 max-w-4xl mx-auto">
                    {!isSubmitted ? (
                        <>
                            <button 
                                onClick={handleAddProperty}
                                className="w-full bg-[#000080] hover:bg-blue-900 text-white font-medium py-2.5 rounded-sm shadow-sm transition-colors flex justify-center items-center"
                            >
                                <span className="mr-1">+</span> Add Property
                            </button>
                            <button 
                                onClick={handleClear}
                                className="w-full bg-white border border-[#1a237e] text-[#1a237e] font-medium py-2.5 rounded-sm shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                Clear
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleUpdateProperty}
                            className="w-full bg-[#000080] hover:bg-blue-900 text-white font-medium py-2.5 rounded-sm shadow-sm transition-colors flex justify-center items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Update Property
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom Navigation */}
            {isSubmitted && (
                <div className="mt-12 flex justify-between items-center border-t border-gray-200 pt-6">
                    <button 
                        onClick={() => setCurrentView('Getting Started')}
                        className="flex items-center text-[#1a237e] border border-[#1a237e] px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors bg-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                    
                    <button 
                        onClick={() => setCurrentView('UnitForm')}
                        className="flex items-center text-[#1a237e] border border-[#1a237e] px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors bg-white"
                    >
                        Add Unit(s)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PropertyFormView;