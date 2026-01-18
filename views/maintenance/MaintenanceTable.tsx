
import React, { useState } from 'react';
import { MaintenanceRequest, View } from '../../types';
import { useData } from '../../contexts/DataContext';
import Badge from '../../components/shared/Badge';

interface MaintenanceTableProps {
    requests: MaintenanceRequest[];
    setCurrentView: (view: View) => void;
}

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ requests, setCurrentView }) => {
    const { deleteMaintenanceRequest, setEditingMaintenanceRequest, updateMaintenanceRequest, currentUser } = useData();
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

    const toggleDropdown = (id: number) => {
        setActiveDropdownId(activeDropdownId === id ? null : id);
    };

    const handleEdit = (req: MaintenanceRequest) => {
        setEditingMaintenanceRequest(req);
        setCurrentView('MaintenanceForm');
        setActiveDropdownId(null);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this maintenance request?")) {
            deleteMaintenanceRequest(id);
            setActiveDropdownId(null);
        }
    };

    const handleCloseRequest = (req: MaintenanceRequest) => {
        updateMaintenanceRequest({ ...req, status: 'Closed' });
        setActiveDropdownId(null);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'red';
            case 'Critical': return 'red';
            case 'Medium': return 'yellow';
            default: return 'gray';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'red';
            case 'In Progress': return 'yellow';
            case 'Closed': return 'green';
            default: return 'gray';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Maintenance Requests</h3>
                 <span className="text-sm text-gray-500">{requests.length} Records</span>
            </div>
            <div className="p-4">
                <div className="overflow-x-auto min-h-[300px]">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 font-normal">Title</th>
                                <th className="p-3 font-normal">Property</th>
                                <th className="p-3 font-normal">Unit</th>
                                <th className="p-3 font-normal">Category</th>
                                <th className="p-3 font-normal">Priority</th>
                                <th className="p-3 font-normal">Status</th>
                                <th className="p-3 font-normal">Date</th>
                                <th className="p-3 font-normal">Cost</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {requests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 relative">
                                    <td className="p-3 font-medium text-gray-800">{req.title}</td>
                                    <td className="p-3">{req.propertyName}</td>
                                    <td className="p-3">{req.unitName}</td>
                                    <td className="p-3">{req.category}</td>
                                    <td className="p-3">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${req.priority === 'High' ? 'bg-red-100 text-red-800' : req.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {req.priority}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <Badge color={getStatusColor(req.status) as any}>{req.status}</Badge>
                                    </td>
                                    <td className="p-3 text-xs">{req.date}</td>
                                    <td className="p-3">{req.cost ? req.cost.toLocaleString() : '-'}</td>
                                    <td className="p-3 relative">
                                        <button 
                                            onClick={() => toggleDropdown(req.id)}
                                            className="text-gray-400 hover:text-[#1a237e] px-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>

                                        {activeDropdownId === req.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)}></div>
                                                <div className="absolute right-8 top-2 w-40 bg-white border border-gray-200 rounded shadow-xl z-20 overflow-hidden">
                                                    <button onClick={() => handleEdit(req)} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">Edit</button>
                                                    {req.status !== 'Closed' && (
                                                        <button onClick={() => handleCloseRequest(req)} className="block w-full text-left px-4 py-2 text-xs text-green-600 hover:bg-green-50">Mark as Closed</button>
                                                    )}
                                                    {currentUser?.role === 'Admin' && (
                                                        <button onClick={() => handleDelete(req.id)} className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50">Delete</button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-gray-500">
                                        No maintenance requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center space-x-1 pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&lt;</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceTable;
