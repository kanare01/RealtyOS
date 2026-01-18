
import React, { useState, useEffect, useMemo } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface TenantFormViewProps {
    setCurrentView: (view: View) => void;
}

// Helper Component moved outside
const FormRow = ({ label, subLabel, children, helpIcon = false, alignStart = false }: { label: string, subLabel?: string, children?: React.ReactNode, helpIcon?: boolean, alignStart?: boolean }) => (
    <div className={`flex flex-col md:flex-row ${alignStart ? 'md:items-start' : 'md:items-center'} mb-6`}>
        <div className={`w-full md:w-1/3 text-left md:text-right pr-6 mb-2 md:mb-0 ${alignStart ? 'pt-2.5' : ''}`}>
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

const TenantFormView: React.FC<TenantFormViewProps> = ({ setCurrentView }) => {
    const { properties, getUnitsByProperty, addTenant, updateTenant, addNotification, uploadFile, units } = useData();
    
    // Core Fields
    const [property, setProperty] = useState('');
    const [unit, setUnit] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [countryCode, setCountryCode] = useState('+254');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    // UI State
    const [showBanner, setShowBanner] = useState(true);
    const [showMore, setShowMore] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Advanced / Optional Fields
    const [depositType, setDepositType] = useState('');
    const [depositPaid, setDepositPaid] = useState('');
    const [depositReturned, setDepositReturned] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [email, setEmail] = useState('');
    const [kraPin, setKraPin] = useState('');
    const [penaltyType, setPenaltyType] = useState('');
    const [notes, setNotes] = useState('');
    const [moveInDate, setMoveInDate] = useState('');
    const [moveOutDate, setMoveOutDate] = useState('');
    const [leaseStart, setLeaseStart] = useState('');
    const [leaseExpiry, setLeaseExpiry] = useState('');
    
    // Dynamic Fields
    const [otherPhones, setOtherPhones] = useState([{ name: '', phone: '' }]);
    const [nextOfKin, setNextOfKin] = useState([{ name: '', phone: '', relationship: '', otherInfo: '' }]);
    const [bankPayers, setBankPayers] = useState(['']);

    // File Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Initial property selection
    useEffect(() => {
        if (properties.length > 0 && !property && !isEditing) {
            setProperty(properties[0].name);
        }
    }, [properties, property, isEditing]);

    // Fetch units for selected property
    const availableUnits = useMemo(() => {
        return getUnitsByProperty(property).filter(u => u.status === 'Vacant' || (isEditing && u.name === unit));
    }, [property, getUnitsByProperty, isEditing, unit]);

    // Reset unit when property changes, unless editing
    useEffect(() => {
        if (!isEditing) {
            setUnit('');
        }
    }, [property, isEditing]);

    const handleClear = () => {
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setDepositType('');
        setDepositPaid('');
        setDepositReturned('');
        setAccountNumber('');
        setNationalId('');
        setEmail('');
        setKraPin('');
        setPenaltyType('');
        setNotes('');
        setMoveInDate('');
        setMoveOutDate('');
        setLeaseStart('');
        setLeaseExpiry('');
        setOtherPhones([{ name: '', phone: '' }]);
        setNextOfKin([{ name: '', phone: '', relationship: '', otherInfo: '' }]);
        setBankPayers(['']);
        setSelectedFile(null);
        // Keep property selected
        setIsSubmitted(false);
        setIsEditing(false);
        setEditId(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSaveTenant = async (isEdit: boolean) => {
        if (!firstName || !lastName || !phoneNumber || !unit) {
            addNotification("Please fill in required fields (Name, Phone, Unit)", 'error');
            return;
        }

        setIsProcessing(true);

        const selectedUnitObj = availableUnits.find(u => u.name === unit);
        const selectedPropObj = properties.find(p => p.name === property);

        const tenantData: any = {
            id: isEdit && editId ? editId : Date.now(),
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            email: email || 'N/A',
            phone: `${countryCode}${phoneNumber}`,
            propertyId: selectedPropObj?.id || 0,
            property: property,
            unitId: selectedUnitObj?.id || 0,
            unit: unit,
            leaseEndDate: leaseExpiry || 'N/A',
            status: 'Active',
            avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            balance: 0,
            depositType,
            depositPaid: parseFloat(depositPaid) || 0,
            depositReturned: parseFloat(depositReturned) || 0,
            accountNumber,
            nationalId,
            kraPin,
            penaltyType,
            notes,
            moveInDate,
            moveOutDate,
            leaseStartDate: leaseStart,
            otherPhones,
            nextOfKin,
            bankPayers
        };

        let savedTenant;
        if (isEdit) {
            savedTenant = await updateTenant(tenantData);
            if(savedTenant) addNotification('Tenant Updated Successfully', 'success');
        } else {
            savedTenant = await addTenant(tenantData);
            if(savedTenant) addNotification('Tenant Added Successfully', 'success');
        }

        // Handle File Upload if tenant saved successfully and file exists
        if (savedTenant && selectedFile) {
            addNotification('Uploading document...', 'info');
            await uploadFile(selectedFile, 'tenant_documents', { tenant_id: savedTenant.id });
        }

        setIsProcessing(false);
        setIsSubmitted(true);
    };

    const handleAddAnother = () => {
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setSelectedFile(null);
        setIsSubmitted(false);
    };

    // Dynamic Field Handlers
    const addOtherPhone = () => setOtherPhones([...otherPhones, { name: '', phone: '' }]);
    const addNextOfKin = () => setNextOfKin([...nextOfKin, { name: '', phone: '', relationship: '', otherInfo: '' }]);
    const removeNextOfKin = (index: number) => {
        const newKin = [...nextOfKin];
        newKin.splice(index, 1);
        setNextOfKin(newKin);
    };
    const addBankPayer = () => setBankPayers([...bankPayers, '']);

    // --- Empty State Check ---
    if (units.length === 0) {
        return (
            <div className="w-full max-w-3xl mx-auto mt-20 text-center animate-fadeIn">
                <div className="bg-white border border-gray-200 rounded-lg p-10 shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1a237e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No Units Available</h2>
                    <p className="text-gray-500 mb-6">You need to add units before you can register tenants.</p>
                    <button 
                        onClick={() => setCurrentView('UnitForm')}
                        className="bg-[#1a237e] text-white px-6 py-2.5 rounded font-medium hover:bg-blue-900 transition-colors"
                    >
                        Add Units
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn w-full max-w-5xl mx-auto pb-20 relative px-4 md:px-0">
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

            <h2 className="text-2xl font-normal text-gray-700 mb-6">{isEditing ? 'Edit Tenant' : 'Tenant Form'}</h2>

            {showBanner && !isEditing && (
                <div className="relative bg-white border border-gray-200 border-l-4 border-l-green-500 rounded-sm p-4 mb-8 shadow-sm flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Add a Tenant in order to complete On boarding.</p>
                    <button onClick={() => setShowBanner(false)} className="text-gray-300 hover:text-gray-500 font-bold">×</button>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                <FormRow label="Select Property" subLabel={availableUnits.length === 0 && property ? "If the property is not available in the list, please go to the properties page to add it." : ""}>
                    <select 
                        value={property}
                        onChange={(e) => setProperty(e.target.value)}
                        disabled={isEditing}
                        className={`w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border ${isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {properties.map(prop => (
                            <option key={prop.id} value={prop.name}>{prop.name}</option>
                        ))}
                    </select>
                </FormRow>

                <FormRow label="Select Unit" subLabel={availableUnits.length === 0 ? "No vacant units found in this property. Go to Units page to add more." : ""}>
                    <select 
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                        disabled={!property || availableUnits.length === 0}
                    >
                        <option value="">Select Unit</option>
                        {availableUnits.map(u => (
                            <option key={u.id} value={u.name}>{u.name} - {u.rentAmount.toLocaleString()}</option>
                        ))}
                    </select>
                </FormRow>

                <FormRow label="First Name">
                    <input 
                        type="text" 
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                    />
                </FormRow>

                <FormRow label="Last Name">
                    <input 
                        type="text" 
                        placeholder="Last name ..."
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                    />
                </FormRow>

                <FormRow label="Phone Number" subLabel="The phone number should be in international format: country code then phone number.">
                    <div className="flex gap-0">
                        <div className="flex items-center border border-r-0 border-gray-200 rounded-l-sm bg-white px-2 min-w-[80px]">
                            <span className="mr-1">🇰🇪</span>
                            <span className="text-sm">+254</span>
                        </div>
                        <input 
                            type="text" 
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="flex-1 border-gray-200 rounded-r-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                        />
                    </div>
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
                        <FormRow label="Deposit (optional)">
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="deposit type ..."
                                        value={depositType}
                                        onChange={(e) => setDepositType(e.target.value)}
                                        className="flex-grow border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                                    />
                                    <button className="px-3 py-1 border border-gray-300 rounded-sm bg-white hover:bg-gray-50 text-gray-600 font-bold">+</button>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 mb-1">Amount Paid</label>
                                        <input 
                                            type="number"
                                            placeholder="amount paid ..." 
                                            value={depositPaid}
                                            onChange={(e) => setDepositPaid(e.target.value)}
                                            className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 mb-1">Amount Returned</label>
                                        <input 
                                            type="number"
                                            placeholder="amount returned ..." 
                                            value={depositReturned}
                                            onChange={(e) => setDepositReturned(e.target.value)}
                                            className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                                        />
                                    </div>
                                </div>
                            </div>
                        </FormRow>

                        <FormRow label="Account Number (optional)" subLabel="Used when reconciling payments.">
                            <input 
                                type="text" 
                                placeholder="Account Number. ..."
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>

                        <FormRow label="National ID (optional)">
                            <input 
                                type="text" 
                                placeholder="National ID number ..."
                                value={nationalId}
                                onChange={(e) => setNationalId(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>

                        <FormRow label="Email (optional)">
                            <input 
                                type="email" 
                                placeholder="Email ..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border"
                            />
                        </FormRow>

                        <FormRow label="Kra/Tax Pin (optional)">
                            <input 
                                type="text" 
                                placeholder="Tax Pin ..."
                                value={kraPin}
                                onChange={(e) => setKraPin(e.target.value)}
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

                        <FormRow label="Notes (optional)">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="notes ..."
                                rows={3}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-gray-50 border resize-none"
                            />
                        </FormRow>

                        <FormRow label="Move In Date (optional)">
                            <input 
                                type="date" 
                                value={moveInDate}
                                onChange={(e) => setMoveInDate(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                            />
                        </FormRow>

                        <FormRow label="Move Out Date (optional)">
                            <input 
                                type="date" 
                                value={moveOutDate}
                                onChange={(e) => setMoveOutDate(e.target.value)}
                                className="w-full border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                            />
                        </FormRow>

                        <FormRow label="Other phone numbers (optional)" subLabel="first name and phone number are used when reconciling payments.">
                            {otherPhones.map((phone, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="first name"
                                        className="w-1/2 border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                                    />
                                    <div className="w-1/2 flex gap-0">
                                        <div className="flex items-center border border-r-0 border-gray-300 rounded-l-sm bg-white px-2 min-w-[60px]">
                                            <span className="mr-1">🇰🇪</span>
                                            <span className="text-xs">+254</span>
                                        </div>
                                        <input 
                                            type="text" 
                                            className="flex-1 border-gray-200 rounded-r-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="text-xs text-gray-500 mb-2">The phone number should be in international format: country code then phone number.</div>
                            <button onClick={addOtherPhone} className="px-3 py-1 border border-gray-300 rounded-sm bg-white hover:bg-gray-50 text-gray-600 font-bold">+</button>
                        </FormRow>

                        <FormRow label="Next of Kin (optional)" alignStart>
                            {nextOfKin.map((kin, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-sm p-4 mb-4 relative bg-gray-50">
                                    <button onClick={() => removeNextOfKin(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <div className="text-xs text-gray-400 mb-2">Next of Kin #{idx + 1}</div>
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Name</label>
                                            <input type="text" placeholder="Name" className="w-full border-gray-200 rounded-sm text-sm p-2 bg-white border"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Phone</label>
                                            <div className="flex gap-0">
                                                <div className="flex items-center border border-r-0 border-gray-300 rounded-l-sm bg-white px-2">
                                                    <span className="mr-1">🇰🇪</span>
                                                    <span className="text-xs">+254</span>
                                                </div>
                                                <input type="text" className="flex-1 border-gray-200 rounded-r-sm text-sm p-2 bg-white border"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Relationship</label>
                                            <input type="text" placeholder="Relationship" className="w-full border-gray-200 rounded-sm text-sm p-2 bg-white border"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Other info</label>
                                            <input type="text" placeholder="Other information" className="w-full border-gray-200 rounded-sm text-sm p-2 bg-white border"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addNextOfKin} className="px-3 py-1 border border-gray-300 rounded-sm bg-white hover:bg-gray-50 text-gray-600 font-bold">+</button>
                        </FormRow>

                        <FormRow label="Bank Payer Names (optional)" helpIcon>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Enter Full Name ..."
                                    className="flex-1 border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                                />
                                <button className="px-3 py-1 border border-gray-300 rounded-sm bg-white hover:bg-gray-50 text-gray-600 font-bold">+</button>
                            </div>
                        </FormRow>

                        <FormRow label="Lease Start Date (optional)" helpIcon>
                            <input 
                                type="date" 
                                value={leaseStart}
                                onChange={(e) => setLeaseStart(e.target.value)}
                                className="w-full md:w-1/2 border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                            />
                        </FormRow>

                        <FormRow label="Lease Expiry Date (optional)" helpIcon>
                            <input 
                                type="date" 
                                value={leaseExpiry}
                                onChange={(e) => setLeaseExpiry(e.target.value)}
                                className="w-full md:w-1/2 border-gray-200 rounded-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 bg-white border"
                            />
                        </FormRow>

                        <FormRow label="File upload (optional)">
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer bg-white border border-[#1a237e] text-[#1a237e] text-sm font-medium py-1.5 px-4 rounded hover:bg-blue-50 transition-colors">
                                    {selectedFile ? 'Change File' : 'Choose file'}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleFileSelect}
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                    />
                                </label>
                                <span className="text-sm text-gray-400">
                                    {selectedFile ? selectedFile.name : 'No file chosen'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">File can be lease agreement, or any other tenant document</p>
                        </FormRow>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-8 max-w-4xl mx-auto">
                    {!isSubmitted ? (
                        <>
                            <button 
                                onClick={() => handleSaveTenant(isEditing)}
                                disabled={isProcessing || availableUnits.length === 0}
                                className={`w-full bg-[#5c54a0] hover:bg-blue-900 text-white font-medium py-2.5 rounded-sm shadow-sm transition-colors flex justify-center items-center ${isProcessing || availableUnits.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isProcessing ? (
                                    <span>Processing...</span>
                                ) : (
                                    <>
                                        {isEditing ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Update Tenant
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-1">+</span> Add Tenant
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                            {!isEditing && (
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
                                <span className="mr-1">+</span> Add Another Tenant
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
                            onClick={() => setCurrentView('Getting Started')}
                            className="flex items-center text-[#1a237e] border border-[#1a237e] px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors bg-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </button>
                        
                        <button 
                            onClick={() => setCurrentView('Tenants')}
                            className="flex items-center text-[#1a237e] border border-[#1a237e] px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-50 transition-colors bg-white"
                        >
                            View Tenant(s)
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

export default TenantFormView;
