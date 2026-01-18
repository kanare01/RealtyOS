
import React, { useState, useEffect } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';
import { API_BASE_URL } from '../../config';

interface GeneralSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const GeneralSettingsView: React.FC<GeneralSettingsViewProps> = ({ setCurrentView }) => {
    const { addNotification } = useData();
    
    // State for form fields
    const [companyName, setCompanyName] = useState('');
    const [abbreviatedName, setAbbreviatedName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [currency, setCurrency] = useState('KES');
    const [timezone, setTimezone] = useState('Africa/Nairobi');
    const [logoName, setLogoName] = useState('No file chosen');
    
    // MPESA State
    const [mpesaType, setMpesaType] = useState<'paybill' | 'till'>('paybill');
    const [mpesaNumber, setMpesaNumber] = useState('');
    const [mpesaAccount, setMpesaAccount] = useState('');
    const [validatePayments, setValidatePayments] = useState(true);
    
    // Automated Tasks
    const [autoRentInvoice, setAutoRentInvoice] = useState(false);
    const [autoOtherInvoice, setAutoOtherInvoice] = useState(false);
    const [alertLandlord, setAlertLandlord] = useState(false);
    const [autoAck, setAutoAck] = useState(true);
    
    // Other settings
    const [leaseExpiryRange, setLeaseExpiryRange] = useState('30 Days');
    const [commSms, setCommSms] = useState(true);
    const [commEmail, setCommEmail] = useState(false);
    const [accountType, setAccountType] = useState('Property Management');

    // UI State
    const [isLoading, setIsLoading] = useState(false);

    // Fetch settings on load
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/settings`, {
                    headers: { 'Authorization': token ? `Bearer ${token}` : '' }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.companyName) setCompanyName(data.companyName);
                    if (data.abbreviatedName) setAbbreviatedName(data.abbreviatedName);
                    if (data.companyAddress) setCompanyAddress(data.companyAddress);
                    if (data.currency) setCurrency(data.currency);
                    if (data.timezone) setTimezone(data.timezone);
                    if (data.mpesaType) setMpesaType(data.mpesaType);
                    if (data.mpesaNumber) setMpesaNumber(data.mpesaNumber);
                    if (data.mpesaAccount) setMpesaAccount(data.mpesaAccount);
                    if (data.validatePayments) setValidatePayments(data.validatePayments === 'true');
                    if (data.autoRentInvoice) setAutoRentInvoice(data.autoRentInvoice === 'true');
                    if (data.accountType) setAccountType(data.accountType);
                }
            } catch (error) {
                console.error("Failed to load settings", error);
            }
        };
        fetchSettings();
    }, []);

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

    const handleUpdateSettings = async () => {
        setIsLoading(true);
        const payload = {
            companyName,
            abbreviatedName,
            companyAddress,
            currency,
            timezone,
            mpesaType,
            mpesaNumber,
            mpesaAccount,
            validatePayments: validatePayments.toString(),
            autoRentInvoice: autoRentInvoice.toString(),
            autoOtherInvoice: autoOtherInvoice.toString(),
            alertLandlord: alertLandlord.toString(),
            autoAck: autoAck.toString(),
            leaseExpiryRange,
            commSms: commSms.toString(),
            commEmail: commEmail.toString(),
            accountType
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                addNotification('Settings updated successfully', 'success');
            } else {
                addNotification('Failed to update settings', 'error');
            }
        } catch (error) {
            addNotification('Network error updating settings', 'error');
        } finally {
            setIsLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setLogoName(e.target.files[0].name);
        }
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
                                    item.view === 'General'
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
                        <h2 className="text-2xl font-medium text-gray-700">General</h2>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-8 space-y-10">
                        
                        {/* Company Section */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Company</h3>
                            
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Company Name..." 
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-gray-50 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Abbreviated Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Abbreviated Name ..." 
                                        value={abbreviatedName}
                                        onChange={(e) => setAbbreviatedName(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-gray-50 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Company Address (optional)</label>
                                    <textarea 
                                        placeholder="Company Address..." 
                                        value={companyAddress}
                                        onChange={(e) => setCompanyAddress(e.target.value)}
                                        rows={3}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-gray-50 border resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Logo (Optional)</label>
                                    <div className="flex items-center gap-3">
                                        <label className="cursor-pointer bg-white border border-[#1a237e] text-[#1a237e] text-sm font-medium py-1.5 px-4 rounded hover:bg-blue-50 transition-colors">
                                            Choose file
                                            <input type="file" className="hidden" onChange={handleFileChange} />
                                        </label>
                                        <span className="text-sm text-gray-400">{logoName}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Currency & Timezone */}
                        <section className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-800 mb-2">Currency</h3>
                                <select 
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border min-w-[100px] text-[#1a237e] font-medium"
                                >
                                    <option value="KES">KES</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-800 mb-2">Timezone</h3>
                                <select 
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full sm:w-64 border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border text-gray-700"
                                >
                                    <option value="Africa/Nairobi">Africa/Nairobi (GMT+3)</option>
                                    <option value="UTC">UTC (GMT+0)</option>
                                    <option value="America/New_York">New York (GMT-5)</option>
                                    <option value="Europe/London">London (GMT+0)</option>
                                    <option value="Asia/Dubai">Dubai (GMT+4)</option>
                                </select>
                            </div>
                        </section>

                        {/* MPESA */}
                        <section className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-800 border-b pb-2">MPESA</h3>
                            
                            <div className="flex space-x-6">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="mpesaType" 
                                        checked={mpesaType === 'paybill'} 
                                        onChange={() => setMpesaType('paybill')}
                                        className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300" 
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Paybill</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="mpesaType" 
                                        checked={mpesaType === 'till'} 
                                        onChange={() => setMpesaType('till')}
                                        className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300" 
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Till Number</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-500 mb-1">
                                        {mpesaType === 'paybill' ? 'Paybill Number' : 'Till Number'}
                                        <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help" title="The business number">i</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder={mpesaType === 'paybill' ? 'Paybill Number ...' : 'Till Number ...'}
                                        value={mpesaNumber}
                                        onChange={(e) => setMpesaNumber(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-gray-50 border"
                                    />
                                </div>
                                {mpesaType === 'paybill' && (
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-500 mb-1">
                                            Paybill Default Account #
                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help" title="Default account if none provided">i</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder="Default Account Number..."
                                            value={mpesaAccount}
                                            onChange={(e) => setMpesaAccount(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-gray-50 border"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input 
                                    id="validate" 
                                    type="checkbox" 
                                    checked={validatePayments}
                                    onChange={(e) => setValidatePayments(e.target.checked)}
                                    className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                />
                                <label htmlFor="validate" className="ml-2 text-sm text-gray-600">Validate Payments</label>
                            </div>
                        </section>

                        {/* Automated Tasks */}
                        <section className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Automated Invoices Tasks</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input 
                                            id="autoRent" 
                                            type="checkbox" 
                                            checked={autoRentInvoice}
                                            onChange={(e) => setAutoRentInvoice(e.target.checked)}
                                            className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                        />
                                        <label htmlFor="autoRent" className="ml-2 text-sm text-gray-600 flex items-center">
                                            Automatically generate rent invoices
                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help" title="Info">i</span>
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="autoOther" 
                                            type="checkbox" 
                                            checked={autoOtherInvoice}
                                            onChange={(e) => setAutoOtherInvoice(e.target.checked)}
                                            className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                        />
                                        <label htmlFor="autoOther" className="ml-2 text-sm text-gray-600 flex items-center">
                                            Automatically generate other recurring bills invoices
                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help" title="Info">i</span>
                                        </label>
                                    </div>
                                    <p className="text-sm text-cyan-600 mt-2 pl-6 bg-cyan-50 p-2 rounded inline-block">
                                        This task runs automatically between 1st and 5th of each month. Next run will be on 1/1/2026
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Other Automated Tasks</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input 
                                            id="alertLandlord" 
                                            type="checkbox" 
                                            checked={alertLandlord}
                                            onChange={(e) => setAlertLandlord(e.target.checked)}
                                            className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                        />
                                        <label htmlFor="alertLandlord" className="ml-2 text-sm text-gray-600 flex items-center">
                                            Alert landlord when new tenant is added to their property
                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help" title="Info">i</span>
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="autoAck" 
                                            type="checkbox" 
                                            checked={autoAck}
                                            onChange={(e) => setAutoAck(e.target.checked)}
                                            className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                        />
                                        <label htmlFor="autoAck" className="ml-2 text-sm text-gray-600 flex items-center">
                                            Automatically send acknowledgement for received payments
                                            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help" title="Info">i</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Account Type */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">Account Type</h3>
                            <p className="text-sm text-gray-500">Select Account/Property Type</p>
                            <select 
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-white border"
                            >
                                <option value="Property Management">Property Management</option>
                                <option value="Landlord">Landlord</option>
                            </select>
                        </section>

                        {/* Action Bar inside Card */}
                        <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                            <button 
                                onClick={handleUpdateSettings}
                                disabled={isLoading}
                                className={`bg-[#1a237e] hover:bg-blue-900 text-white font-medium py-2 px-6 rounded-md text-sm transition-colors shadow-sm flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : 'Update Settings'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettingsView;
