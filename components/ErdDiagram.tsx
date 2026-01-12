
import React from 'react';

const Entity: React.FC<{ name: string; attributes: string[]; }> = ({ name, attributes }) => (
    <div className="bg-gray-800 border border-gray-600/50 rounded-lg shadow-lg w-64 m-4">
        <div className="bg-gray-700/50 p-2 border-b border-gray-600/50">
            <h4 className="font-bold text-center text-cyan-400">{name}</h4>
        </div>
        <ul className="p-3 text-sm text-gray-300">
            {attributes.map(attr => (
                <li key={attr} className="py-1">{attr}</li>
            ))}
        </ul>
    </div>
);

const Relationship: React.FC<{ from: string; to: string; type: string; }> = ({ from, to, type }) => (
    <div className="text-center text-gray-400 text-sm">
        <span className="font-semibold text-cyan-300">{from}</span> (1) {'<--'} <span className="italic">{type}</span> {'-->'} (N) <span className="font-semibold text-cyan-300">{to}</span>
    </div>
);

const ErdDiagram: React.FC = () => {
  return (
    <div className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-6 mt-8">
       <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white mb-2">Entity-Relationship Diagram</h2>
        <p className="text-gray-400">Simplified view of the core database schema.</p>
      </div>
      
      <div className="flex flex-wrap items-start justify-center">
        <Entity name="Property" attributes={['id (PK)', 'name', 'address', 'type', 'units_count']} />
        <Entity name="Unit" attributes={['id (PK)', 'property_id (FK)', 'unit_number', 'rent_amount', 'status']} />
        <Entity name="Tenant" attributes={['id (PK)', 'name', 'email', 'phone']} />
        <Entity name="Lease" attributes={['id (PK)', 'unit_id (FK)', 'tenant_id (FK)', 'start_date', 'end_date', 'status']} />
        <Entity name="Invoice" attributes={['id (PK)', 'lease_id (FK)', 'amount', 'due_date', 'status']} />
        <Entity name="Payment" attributes={['id (PK)', 'invoice_id (FK)', 'amount', 'payment_date', 'method']} />
      </div>

      <div className="mt-8 space-y-4">
        <Relationship from="Property" to="Unit" type="has many" />
        <Relationship from="Unit" to="Lease" type="can have one active" />
        <Relationship from="Tenant" to="Lease" type="can have many" />
        <Relationship from="Lease" to="Invoice" type="generates many" />
        <Relationship from="Invoice" to="Payment" type="can have many" />
      </div>
    </div>
  );
};

export default ErdDiagram;
