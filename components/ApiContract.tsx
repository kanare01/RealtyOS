
import React from 'react';

const CodeBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-900/70 rounded-lg overflow-hidden border border-gray-700">
    <div className="bg-gray-700/50 py-2 px-4">
      <h4 className="text-sm font-semibold text-gray-300">{title}</h4>
    </div>
    <pre className="p-4 text-xs text-pink-300 overflow-x-auto">
      <code>{children}</code>
    </pre>
  </div>
);

const ApiContract: React.FC = () => {
  const queryExample = `
query GetPropertyDetails($id: ID!) {
  property(id: $id) {
    id
    name
    address
    units {
      id
      unitNumber
      status
      tenant {
        name
      }
    }
  }
}`;

  const mutationExample = `
mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    invoice {
      id
      status
      dueDate
      amount
    }
    errors {
      field
      message
    }
  }
}`;

  return (
    <div className="bg-gray-800 border border-gray-600/50 rounded-lg p-6 flex flex-col shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">GraphQL API Contract</h3>
        <p className="text-sm text-gray-400">
          The backend exposes a GraphQL API for flexible and efficient data fetching. All frontend communication goes through a single endpoint.
        </p>
      </div>
      <div className="space-y-6">
        <CodeBlock title="Example Query: Fetch Property">{queryExample.trim()}</CodeBlock>
        <CodeBlock title="Example Mutation: Create Invoice">{mutationExample.trim()}</CodeBlock>
      </div>
    </div>
  );
};

export default ApiContract;
