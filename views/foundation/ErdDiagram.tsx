
import React from 'react';

const Entity: React.FC<{ name: string; attributes: string[]; }> = ({ name, attributes }) => (
    <div className="bg-white border border-gray-300 rounded shadow-md w-64 m-4 overflow-hidden">
        <div className="bg-gray-100 p-2 border-b border-gray-300">
            <h4 className="font-bold text-center text-[#1a237e]">{name}</h4>
        </div>
        <ul className="p-3 text-sm text-gray-700 bg-white">
            {attributes.map(attr => (
                <li key={attr} className="py-1 border-b border-gray-50 last:border-0">{attr}</li>
            ))}
        </ul>
    </div>
);

const Relationship: React.FC<{ from: string; to: string; type: string; }> = ({ from, to, type }) => (
    <div className="text-center text-gray-500 text-sm py-1">
        <span className="font-bold text-gray-800">{from}</span> (1) {'<--'} <span className="italic text-blue-600">{type}</span> {'-->'} (N) <span className="font-bold text-gray-800">{to}</span>
    </div>
);

const ErdDiagram: React.FC = () => {
  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-8 mt-4">
       <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Entity-Relationship Diagram</h2>
        <p className="text-gray-500">Simplified view of the core database schema.</p>
      </div>
      
      <div className="flex flex-wrap items-start justify-center mb-8">
        <Entity name="Property" attributes={['id (PK)', 'name', 'address', 'type', 'units_count']} />
        <Entity name="Unit" attributes={['id (PK)', 'property_id (FK)', 'unit_number', 'rent_amount', 'status']} />
        <Entity name="Tenant" attributes={['id (PK)', 'name', 'email', 'phone']} />
        <Entity name="Lease" attributes={['id (PK)', 'unit_id (FK)', 'tenant_id (FK)', 'start_date', 'end_date', 'status']} />
        <Entity name="Invoice" attributes={['id (PK)', 'lease_id (FK)', 'amount', 'due_date', 'status']} />
        <Entity name="Payment" attributes={['id (PK)', 'invoice_id (FK)', 'amount', 'payment_date', 'method']} />
      </div>

      <div className="bg-white p-6 rounded border border-gray-200 max-w-2xl mx-auto">
        <h4 className="text-center font-bold text-gray-400 uppercase text-xs mb-4">Relationship Map</h4>
        <div className="space-y-2">
            <Relationship from="Property" to="Unit" type="has many" />
            <Relationship from="Unit" to="Lease" type="can have one active" />
            <Relationship from="Tenant" to="Lease" type="can have many" />
            <Relationship from="Lease" to="Invoice" type="generates many" />
            <Relationship from="Invoice" to="Payment" type="can have many" />
        </div>
      </div>
    </div>
  );
};

export default ErdDiagram;
