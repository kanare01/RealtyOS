
import React from 'react';

const Box: React.FC<{ title: string; items: string[]; className?: string }> = ({ title, items, className }) => (
    <div className={`bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm flex flex-col items-center hover:border-blue-200 transition-colors ${className}`}>
        <h3 className="text-sm font-bold text-[#1a237e] mb-2 uppercase tracking-wide">{title}</h3>
        <ul className="text-center text-xs text-gray-600 font-medium">
            {items.map(item => <li key={item} className="mb-1">{item}</li>)}
        </ul>
    </div>
);

const Connector: React.FC<{ vertical?: boolean, className?: string}> = ({ vertical = false, className }) => (
    <div className={`flex items-center justify-center ${vertical ? 'flex-col h-12' : 'flex-row w-12'} ${className}`}>
        <div className={`bg-gray-300 ${vertical ? 'w-0.5 h-full' : 'h-0.5 w-full'}`}></div>
    </div>
);

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">System Architecture</h2>
        <p className="text-gray-500">High-level overview of the RealtyOS platform components and integrations.</p>
      </div>

      <div className="flex flex-col items-center">
        {/* Frontend */}
        <Box title="Frontend" items={['React + TypeScript', 'Context API', 'Tailwind CSS']} className="w-64 border-blue-500" />
        <Connector vertical />
        
        {/* Backend */}
        <Box title="Backend API" items={['Flask (Python)', 'RESTful Endpoints']} className="w-64 border-green-500" />
        <Connector vertical />

        {/* Core Services Layer */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            <Box title="Database" items={['PostgreSQL']} className="w-56" />
            <Connector className="hidden md:flex"/>
            <Box title="Caching" items={['Redis']} className="w-56" />
            <Connector className="hidden md:flex"/>
            <Box title="Background Jobs" items={['Celery + RabbitMQ']} className="w-56" />
        </div>
        
        <Connector vertical />

        {/* Third-Party Services */}
        <div className="text-center mb-4 mt-2">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">External Services & Integrations</h3>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            <Box title="File Storage" items={['AWS S3']} className="w-56 bg-gray-50 border-gray-300" />
            <Connector className="hidden md:flex"/>
            <Box title="Notifications" items={['SMS Gateway (Twilio)', 'Email Provider (SendGrid)']} className="w-56 bg-gray-50 border-gray-300" />
            <Connector className="hidden md:flex"/>
            <Box title="CI/CD & DevOps" items={['Docker Compose', 'GitHub Actions', 'Vault']} className="w-56 bg-gray-50 border-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
