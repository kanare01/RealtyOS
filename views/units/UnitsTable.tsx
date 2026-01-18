
import React, { useState } from 'react';
import { Unit, View } from '../../types';
import Badge from '../../components/shared/Badge';
import { useData } from '../../contexts/DataContext';

interface UnitsTableProps {
    units: Unit[];
    setCurrentView: (view: View) => void;
}

const UnitsTable: React.FC<UnitsTableProps> = ({ units, setCurrentView }) => {
    const { deleteUnit, setEditingUnit, currentUser } = useData();
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

    const toggleDropdown = (id: number) => {
        if (activeDropdownId === id) {
            setActiveDropdownId(null);
        } else {
            setActiveDropdownId(id);
        }
    };

    const handleEdit = (unit: Unit) => {
        setEditingUnit(unit);
        setCurrentView('UnitForm');
        setActiveDropdownId(null);
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete unit ${name}?`)) {
            deleteUnit(id);
            setActiveDropdownId(null);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Units</h3>
                 <span className="text-sm text-gray-500">{units.length} Records</span>
            </div>
            <div className="p-4">
                <div className="overflow-x-auto min-h-[300px]">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 font-normal">Property Name</th>
                                <th className="p-3 font-normal">Unit Name/ID</th>
                                <th className="p-3 font-normal">Type</th>
                                <th className="p-3 font-normal">Status</th>
                                <th className="p-3 font-normal">Rent (KES)</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {units.map(unit => (
                                <tr key={unit.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 relative">
                                    <td className="p-3 font-medium text-[#1a237e]">{unit.propertyName}</td>
                                    <td className="p-3">{unit.name}</td>
                                    <td className="p-3">{unit.type}</td>
                                    <td className="p-3">
                                        <Badge color={unit.status === 'Occupied' ? 'green' : 'yellow'}>{unit.status}</Badge>
                                    </td>
                                    <td className="p-3 font-semibold">{unit.rentAmount.toLocaleString()}</td>
                                    <td className="p-3 relative">
                                        <button 
                                            onClick={() => toggleDropdown(unit.id)}
                                            className="text-gray-400 hover:text-[#1a237e] px-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>

                                        {activeDropdownId === unit.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)}></div>
                                                <div className="absolute right-8 top-2 w-40 bg-white border border-gray-200 rounded shadow-xl z-20 overflow-hidden">
                                                    <button 
                                                        onClick={() => handleEdit(unit)}
                                                        className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    {currentUser?.role === 'Admin' && (
                                                        <button 
                                                            onClick={() => handleDelete(unit.id, unit.name)}
                                                            className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {units.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No units found. Add a unit to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center space-x-1 pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&laquo;</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&raquo;</button>
                </div>
            </div>
        </div>
    );
};

export default UnitsTable;
