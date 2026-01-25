
import React, { useState, useRef } from 'react';
import { View } from '../../types';

interface AccountInfoSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const AccountInfoSettingsView: React.FC<AccountInfoSettingsViewProps> = ({ setCurrentView }) => {
    // Profile State
    const [profile, setProfile] = useState({
        username: 'k254',
        firstName: '',
        lastName: '',
        email: 'kwash904@gmail.com'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);

    // Password Modal State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    
    // Agent Code State
    const [agentCode, setAgentCode] = useState<string | null>(null);
    
    // Signature State
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // UI State
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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

    // Helper: Show Notification
    const showNotificationMsg = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Handler: Save Profile
    const handleSaveProfile = () => {
        setIsLoading(true);
        setTimeout(() => {
            setProfile(tempProfile);
            setIsEditing(false);
            setIsLoading(false);
            showNotificationMsg('Profile updated successfully.');
        }, 800);
    };

    // Handler: Change Password
    const handleChangePassword = () => {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            showNotificationMsg('Please fill in all password fields.', 'error');
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            showNotificationMsg('New passwords do not match.', 'error');
            return;
        }
        
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowPasswordModal(false);
            setPasswordForm({ current: '', new: '', confirm: '' });
            showNotificationMsg('Password changed successfully.');
        }, 1000);
    };

    // Handler: Generate Agent Code
    const handleGenerateCode = () => {
        setIsLoading(true);
        setTimeout(() => {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            setAgentCode(code);
            setIsLoading(false);
            showNotificationMsg('New Agent Code generated.');
        }, 500);
    };

    // Handler: Copy Code
    const handleCopyCode = () => {
        if (agentCode) {
            navigator.clipboard.writeText(agentCode);
            showNotificationMsg('Agent code copied to clipboard.', 'info');
        }
    };

    // Handler: Signature Upload
    const handleSignatureClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            showNotificationMsg(`Signature uploaded: ${fileName}`);
        }
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 right-4 md:right-10 z-50 animate-fadeIn">
                    <div className={`${
                        notification.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 
                        notification.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' :
                        'bg-blue-100 border-blue-400 text-blue-700'
                    } border px-4 py-3 rounded relative shadow-lg`} role="alert">
                        <span className="block sm:inline">{notification.message}</span>
                    </div>
                </div>
            )}

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input 
                                    type="password" 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                    value={passwordForm.current}
                                    onChange={e => setPasswordForm({...passwordForm, current: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                    value={passwordForm.new}
                                    onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                    value={passwordForm.confirm}
                                    onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
                            <button 
                                onClick={() => setShowPasswordModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleChangePassword}
                                disabled={isLoading}
                                className="px-4 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 text-sm font-medium transition-colors shadow-sm"
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
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
                                    item.view === 'Account Info'
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
                <div className="flex-1 space-y-6">
                    
                    {/* Account Details */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 relative">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium text-gray-800">Account Details</h2>
                            {!isEditing ? (
                                <button 
                                    onClick={() => { setIsEditing(true); setTempProfile(profile); }}
                                    className="text-sm text-blue-600 hover:underline font-medium"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-bold"
                                    >
                                        {isLoading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <label className="block text-gray-500 mb-1">Username</label>
                                    <div className="font-medium text-gray-800 p-2 bg-gray-50 rounded border border-transparent">{profile.username}</div>
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">Email</label>
                                    <div className="font-medium text-gray-800 p-2 bg-gray-50 rounded border border-transparent">{profile.email}</div>
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">First Name</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={tempProfile.firstName}
                                            onChange={e => setTempProfile({...tempProfile, firstName: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                            placeholder="Enter first name"
                                        />
                                    ) : (
                                        <div className="font-medium text-gray-800 p-2">{profile.firstName || '-'}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">Last Name</label>
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={tempProfile.lastName}
                                            onChange={e => setTempProfile({...tempProfile, lastName: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                            placeholder="Enter last name"
                                        />
                                    ) : (
                                        <div className="font-medium text-gray-800 p-2">{profile.lastName || '-'}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Signature Pad */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-1">Signature pad</h2>
                            <p className="text-gray-500 text-sm">Update your signature for official documents.</p>
                        </div>
                        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <button 
                                onClick={handleSignatureClick}
                                className="bg-[#000080] hover:bg-blue-900 text-white font-medium py-2 px-4 rounded shadow-sm text-sm transition-colors flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Update Signature
                            </button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-1">Password</h2>
                            <p className="text-gray-500 text-sm">A secure password helps protect your RealtyOS Account.</p>
                        </div>
                        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200">
                            <button 
                                onClick={() => setShowPasswordModal(true)}
                                className="bg-[#000080] hover:bg-blue-900 text-white font-medium py-2 px-4 rounded shadow-sm text-sm transition-colors flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Change Password
                            </button>
                        </div>
                    </div>

                    {/* Agent Code */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-800 mb-1">Agent Code</h2>
                            <p className="text-gray-500 text-sm">Generate agent code used in the copilot app.</p>
                            
                            {agentCode && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Your Active Code</span>
                                        <div className="text-2xl font-mono font-bold text-[#1a237e] tracking-widest">{agentCode}</div>
                                    </div>
                                    <button 
                                        onClick={handleCopyCode}
                                        className="text-gray-500 hover:text-[#1a237e] p-2 rounded-full hover:bg-white transition-colors"
                                        title="Copy Code"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200">
                            <button 
                                onClick={handleGenerateCode}
                                disabled={isLoading}
                                className={`bg-[#000080] hover:bg-blue-900 text-white font-medium py-2 px-4 rounded shadow-sm text-sm transition-colors flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        {agentCode ? 'Regenerate Agent Code' : 'Generate Agent Code'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AccountInfoSettingsView;
