
import React, { useState } from 'react';
import { mockProperties } from '../../data/mockData';
import PropertyCard from './PropertyCard';

const PropertiesView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProperties = mockProperties.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fadeIn">
            <div className="text-left mb-6">
                <h2 className="text-3xl font-extrabold text-white mb-2">Property Portfolio</h2>
                <p className="text-gray-400">Manage all your properties from a single view.</p>
            </div>

            <div className="mb-6 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search properties by name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-sm text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 w-full max-w-md"
                />
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">
                    Add Property
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
};

export default PropertiesView;
