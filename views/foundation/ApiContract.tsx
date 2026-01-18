
import React from 'react';

const CodeBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
    <div className="bg-gray-100 py-2 px-4 border-b border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
    </div>
    <pre className="p-4 text-xs text-blue-900 font-mono overflow-x-auto bg-white">
      <code>{children}</code>
    </pre>
  </div>
);

const ApiContract: React.FC = () => {
  const getExample = `
// GET /api/properties
[
  {
    "id": 1,
    "name": "Sunset Apartments",
    "address": "123 Ngong Road",
    "type": "Residential",
    "units": 12,
    "occupancy": 85
  }
]`;

  const postExample = `
// POST /api/invoices
{
  "tenant_id": 105,
  "amount": 25000,
  "due_date": "2025-11-05",
  "items": [
    { "description": "Rent - Nov", "amount": 25000 }
  ]
}

// Response: 201 Created
{
  "id": 8821,
  "status": "Unpaid",
  "invoice_number": "INV-8821",
  "total_amount": 25000
}`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm flex flex-col">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">REST API Contract</h3>
        <p className="text-gray-500">
          The backend exposes a standard RESTful API. Endpoints consume and return JSON.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CodeBlock title="Example: Fetch Properties">{getExample.trim()}</CodeBlock>
        <CodeBlock title="Example: Create Invoice">{postExample.trim()}</CodeBlock>
      </div>
    </div>
  );
};

export default ApiContract;
