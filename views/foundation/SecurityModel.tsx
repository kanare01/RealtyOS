import React from 'react';

const SecurityItem: React.FC<{ title: string; description: string; }> = ({ title, description }) => (
    <li className="flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-1 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </li>
);

const SecurityModel: React.FC = () => {
  return (
     <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-6 mt-8">
       <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white mb-2">Security Model</h2>
        <p className="text-gray-400">Overview of key security principles and practices.</p>
      </div>

      <ul className="space-y-4 max-w-2xl mx-auto">
          <SecurityItem 
            title="Authentication & Authorization"
            description="JWT-based authentication for stateless sessions. Role-based access control (RBAC) is enforced at the API gateway and service level."
          />
          <SecurityItem 
            title="Data Encryption"
            description="All data is encrypted in transit using TLS 1.3. Sensitive PII data (e.g., social security numbers) is encrypted at rest in the database."
          />
          <SecurityItem 
            title="Input Validation & Sanitization"
            description="Strict input validation on all API endpoints to prevent common vulnerabilities like XSS, SQL injection, and command injection."
          />
          <SecurityItem 
            title="Secret Management"
            description="Application secrets, API keys, and database credentials are managed securely using HashiCorp Vault, not stored in source code."
          />
           <SecurityItem 
            title="Dependency Scanning"
            description="Automated dependency scanning (e.g., GitHub Dependabot) is integrated into the CI/CD pipeline to detect and alert on vulnerable packages."
          />
          <SecurityItem 
            title="Logging & Monitoring"
            description="Comprehensive logging of all API requests and critical system events. Real-time monitoring and alerting for suspicious activity."
          />
      </ul>
    </div>
  );
};

export default SecurityModel;