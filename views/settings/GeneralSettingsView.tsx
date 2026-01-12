
import React, { useState } from 'react';
import { View } from '../../types';

interface GeneralSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const GeneralSettingsView: React.FC<GeneralSettingsViewProps> = ({ setCurrentView }) => {
    // State for form fields
    const [companyName, setCompanyName] = useState('');
    const [abbreviatedName, setAbbreviatedName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [currency, setCurrency] = useState('KES');
    
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
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Reminder dates
    const [reminders, setReminders] = useState({
        '5th': false,
        '10th': false,
        '15th': false,
        '20th': false,
        '25th': false
    });

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

    const toggleReminder = (date: keyof typeof reminders) => {
        setReminders(prev => ({ ...prev, [date]: !prev[date] }));
    };

    const handleUpdateSettings = () => {
        // Here you would typically validate and send data to backend
        console.log('Settings Updated:', {
            companyName,
            mpesaNumber,
            reminders,
            accountType
        });
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Scroll to top to see message
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
            {showSuccess && (
                <div className="fixed top-24 right-10 z-50 animate-fadeIn">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-lg" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> Settings updated successfully.</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setShowSuccess(false)}>
                            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                        </span>
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
                                            <input type="file" className="hidden" />
                                        </label>
                                        <span className="text-sm text-gray-400">No file chosen</span>
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
                                </select>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-800 mb-2">Timezone</h3>
                                <button className="border border-[#1a237e] text-[#1a237e] rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-50 transition-colors">
                                    Set Timezone ▼
                                </button>
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
                                    <p className="text-sm text-cyan-500 mt-2 pl-6">
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

                        {/* Reminders */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">Monthly Payment Reminders</h3>
                            <p className="text-sm text-gray-500">Choose date(s) to remind tenants</p>
                            <div className="space-y-2 pl-1">
                                {Object.entries(reminders).map(([day, isActive]) => (
                                    <div key={day} className="flex items-center">
                                        <input 
                                            id={`reminder-${day}`} 
                                            type="checkbox" 
                                            checked={isActive}
                                            onChange={() => toggleReminder(day as keyof typeof reminders)}
                                            className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                        />
                                        <label htmlFor={`reminder-${day}`} className="ml-2 text-sm text-gray-600">{day}</label>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Lease Expiry */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">Lease Expiry Notifications</h3>
                            <p className="text-sm text-gray-500">Receive SMS and dashboard alerts for leases expiring within this range:</p>
                            <select 
                                value={leaseExpiryRange}
                                onChange={(e) => setLeaseExpiryRange(e.target.value)}
                                className="w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2.5 bg-white border"
                            >
                                <option value="30 Days">30 Days</option>
                                <option value="60 Days">60 Days</option>
                                <option value="90 Days">90 Days</option>
                            </select>
                        </section>

                        {/* Communication */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">Communication Options</h3>
                            <p className="text-sm text-gray-500">Select how you want to communicate with tenants. You can choose multiple methods.</p>
                            <div className="space-y-3 pl-1">
                                <div className="flex items-center">
                                    <input 
                                        id="comm-sms" 
                                        type="checkbox" 
                                        checked={commSms}
                                        onChange={(e) => setCommSms(e.target.checked)}
                                        className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                    />
                                    <label htmlFor="comm-sms" className="ml-2 text-sm text-gray-600">SMS</label>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        id="comm-email" 
                                        type="checkbox" 
                                        checked={commEmail}
                                        onChange={(e) => setCommEmail(e.target.checked)}
                                        className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e] border-gray-300 rounded" 
                                    />
                                    <label htmlFor="comm-email" className="ml-2 text-sm text-gray-600">Email</label>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    <span className="text-sm text-gray-400">WhatsApp (coming soon)</span>
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
                                className="bg-[#1a237e] hover:bg-blue-900 text-white font-medium py-2 px-6 rounded-md text-sm transition-colors shadow-sm"
                            >
                                Update Settings
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettingsView;
