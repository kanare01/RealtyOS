
import React from 'react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:border-cyan-400/50">
      <img src={property.imageUrl} alt={property.name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">{property.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{property.address}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-md">{property.type}</span>
          <div className="text-right">
            <p className="font-semibold text-gray-200">{property.units} Units</p>
            <p className="text-gray-400">{property.occupancy}% Occupied</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
