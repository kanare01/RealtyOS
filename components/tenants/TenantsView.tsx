
import React, { useState, useMemo } from 'react';
import { mockTenants } from '../../data/mockData';
import Badge from '../shared/Badge';
import { Tenant } from '../../types';

const TenantsView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTenants = useMemo(() => {
        return mockTenants.filter(tenant =>
            tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.property.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="animate-fadeIn">
            <div className="text-left mb-6">
                <h2 className="text-3xl font-extrabold text-white mb-2">Tenants</h2>
                <p className="text-gray-400">View and manage all tenant information.</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <div className="p-4 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search by name, email, or property..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 w-full md:w-80"
                    />
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">
                        Add Tenant
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Property & Unit</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lease End Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredTenants.map((tenant: Tenant) => (
                                <tr key={tenant.id} className="hover:bg-gray-700/30">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full" src={tenant.avatarUrl} alt={tenant.name} />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{tenant.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">{tenant.property}</div>
                                        <div className="text-sm text-gray-400">Unit {tenant.unit}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">{tenant.email}</div>
                                        <div className="text-sm text-gray-400">{tenant.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.leaseEndDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge color={tenant.status === 'Active' ? 'green' : 'gray'}>{tenant.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-cyan-400 hover:text-cyan-300">View</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TenantsView;
