import React from 'react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-md">
      <img src={property.imageUrl} alt={property.name} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{property.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{property.address}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-semibold">{property.type}</span>
          <div className="text-right">
            <p className="font-semibold text-gray-700">{property.units} Units</p>
            <p className="text-gray-500">{property.occupancy}% Occupied</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;