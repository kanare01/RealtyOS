import React from 'react';

const Box: React.FC<{ title: string; items: string[]; className?: string }> = ({ title, items, className }) => (
    <div className={`bg-gray-800 border border-gray-600/50 rounded-lg p-4 shadow-lg flex flex-col items-center ${className}`}>
        <h3 className="text-lg font-bold text-cyan-400 mb-2">{title}</h3>
        <ul className="text-center text-sm text-gray-300">
            {items.map(item => <li key={item}>{item}</li>)}
        </ul>
    </div>
);

const Connector: React.FC<{ vertical?: boolean, className?: string}> = ({ vertical = false, className }) => (
    <div className={`flex items-center justify-center ${vertical ? 'flex-col h-12' : 'flex-row w-12'} ${className}`}>
        <div className={`bg-gray-600 ${vertical ? 'w-0.5 h-full' : 'h-0.5 w-full'}`}></div>
    </div>
);

const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white mb-2">System Architecture</h2>
        <p className="text-gray-400">High-level overview of the RealtyOS platform components and integrations.</p>
      </div>

      <div className="flex flex-col items-center">
        {/* Frontend */}
        <Box title="Frontend" items={['React + TypeScript', 'Redux Toolkit', 'Apollo Client']} className="w-64" />
        <Connector vertical />
        
        {/* Backend */}
        <Box title="Backend API" items={['Django (Python)', 'Graphene (GraphQL)']} className="w-64" />
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
        <div className="text-center mb-4">
             <h3 className="text-lg font-bold text-cyan-400">External Services & Integrations</h3>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            <Box title="File Storage" items={['AWS S3']} className="w-56" />
            <Connector className="hidden md:flex"/>
            <Box title="Notifications" items={['SMS Gateway (Twilio)', 'Email Provider (SendGrid)']} className="w-56" />
            <Connector className="hidden md:flex"/>
            <Box title="CI/CD & DevOps" items={['Docker Compose', 'GitHub Actions', 'Vault']} className="w-56" />
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
