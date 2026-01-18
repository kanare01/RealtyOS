
import React, { useState } from 'react';
import { View, TeamMember } from '../../types';
import { useData } from '../../contexts/DataContext';

interface TeamSettingsViewProps {
    setCurrentView: (view: View) => void;
}

const CollapsibleCard: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div 
                className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-medium text-[#1a237e]">{title}</h3>
                <button className="text-gray-800 hover:text-gray-600 font-bold text-xl">
                    {isOpen ? '−' : '+'}
                </button>
            </div>
            {isOpen && (
                <div className="p-6 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};

const TeamSettingsView: React.FC<TeamSettingsViewProps> = ({ setCurrentView }) => {
    const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useData();
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState<TeamMember>({ id: 0, name: '', phone: '', username: '', email: '', role: 'Agent' });
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

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

    const handleAddClick = () => {
        setIsEditing(false);
        setCurrentMember({ id: 0, name: '', phone: '', username: '', email: '', role: 'Agent', password: '' });
        setShowModal(true);
    };

    const handleEditClick = (member: TeamMember) => {
        setIsEditing(true);
        setCurrentMember({ ...member, password: '' }); // Don't show password
        setShowModal(true);
        setActiveDropdownId(null);
    };

    const handleDeleteClick = (id: number) => {
        if (confirm('Are you sure you want to remove this team member?')) {
            deleteTeamMember(id);
        }
        setActiveDropdownId(null);
    };

    const handleSave = () => {
        if (!currentMember.name || !currentMember.email || !currentMember.username) {
            alert("Please fill in required fields (Name, Email, Username).");
            return;
        }

        if (isEditing) {
            updateTeamMember(currentMember);
        } else {
            addTeamMember(currentMember);
        }
        setShowModal(false);
    };

    const toggleDropdown = (id: number) => {
        setActiveDropdownId(activeDropdownId === id ? null : id);
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto pb-20 relative">
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800">{isEditing ? 'Edit Team Member' : 'Add Team Member'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                    value={currentMember.name}
                                    onChange={e => setCurrentMember({...currentMember, name: e.target.value})}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                    value={currentMember.email}
                                    onChange={e => setCurrentMember({...currentMember, email: e.target.value})}
                                    placeholder="e.g. john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                    value={currentMember.username}
                                    onChange={e => setCurrentMember({...currentMember, username: e.target.value})}
                                    placeholder="e.g. jdoe"
                                    disabled={isEditing}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                    value={currentMember.phone}
                                    onChange={e => setCurrentMember({...currentMember, phone: e.target.value})}
                                    placeholder="e.g. +254..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                    value={currentMember.role}
                                    onChange={e => setCurrentMember({...currentMember, role: e.target.value})}
                                >
                                    <option value="Agent">Agent</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            {!isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input 
                                        type="password" 
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                        value={currentMember.password}
                                        onChange={e => setCurrentMember({...currentMember, password: e.target.value})}
                                        placeholder="Set initial password"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-4 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 text-sm font-medium transition-colors shadow-sm"
                            >
                                {isEditing ? 'Update Member' : 'Add Member'}
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
                                    item.view === 'Team'
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
                <div className="flex-1 relative">
                    {/* Add Team Member Button */}
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={handleAddClick}
                            className="bg-[#000080] hover:bg-blue-900 text-white text-sm font-medium py-2 px-4 rounded shadow-sm transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Team Member
                        </button>
                    </div>

                    {/* Summary Card */}
                    <CollapsibleCard title="Summary">
                        <div className="flex justify-center items-center">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <span className="h-[1px] w-12 bg-gray-200 mr-3"></span>
                                    <span className="text-gray-500 text-sm">Total Team</span>
                                    <span className="h-[1px] w-12 bg-gray-200 ml-3"></span>
                                </div>
                                <div className="text-[#1a237e] text-3xl font-medium">{teamMembers.length}</div>
                            </div>
                        </div>
                    </CollapsibleCard>

                    {/* Team Members Card */}
                    <CollapsibleCard title="Team Members">
                        <div className="overflow-visible min-h-[300px]">
                            <table className="min-w-full text-sm text-left">
                                <thead className="text-gray-400 font-normal border-b border-gray-100">
                                    <tr>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500 uppercase">Name</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500 uppercase">Role</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500 uppercase">Username</th>
                                        <th className="py-3 pr-4 font-normal text-xs text-gray-500 uppercase">Email</th>
                                        <th className="py-3 font-normal text-xs text-gray-500 uppercase text-right">Options</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600">
                                    {teamMembers.map((member) => (
                                        <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-4 pr-4 font-medium text-gray-800">
                                                {member.name || member.username}
                                            </td>
                                            <td className="py-4 pr-4 text-gray-500">{member.role}</td>
                                            <td className="py-4 pr-4 text-gray-500">{member.username}</td>
                                            <td className="py-4 pr-4 text-gray-500">{member.email}</td>
                                            <td className="py-4 text-right relative">
                                                <button 
                                                    onClick={() => toggleDropdown(member.id)}
                                                    className="inline-flex items-center justify-between px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none"
                                                >
                                                    Options
                                                    <svg className="-mr-1 ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                {activeDropdownId === member.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setActiveDropdownId(null)}></div>
                                                        <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-20">
                                                            <button 
                                                                onClick={() => handleEditClick(member)}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1a237e]"
                                                            >
                                                                Edit Details
                                                            </button>
                                                            <div className="border-t border-gray-100"></div>
                                                            <button 
                                                                onClick={() => handleDeleteClick(member.id)}
                                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                            >
                                                                Remove Member
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {teamMembers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No team members found. Click "Add Team Member" to create one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CollapsibleCard>
                </div>
            </div>
        </div>
    );
};

export default TeamSettingsView;
